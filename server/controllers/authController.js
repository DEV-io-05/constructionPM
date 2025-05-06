import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
import { generateOTP } from '../utils/otpUtils.js';
import { AppError } from '../utils/errorHandler.js';
import SessionManager from '../utils/sessionManager.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, username, phoneNumber } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new AppError('Email or username already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        phoneNumber,
        password: hashedPassword,
        status: 'ACTIVE',
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('Your account is not active', 403);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Create session
    await SessionManager.createSession(user.id, refreshToken, req);

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip
        }
      }
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const session = await SessionManager.updateSessionActivity(refreshToken);

    if (!session) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('User not found or inactive', 401);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid refresh token', 401));
    } else {
      next(error);
    }
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    await SessionManager.invalidateSession(refreshToken, req.user.id);

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: req.user.id,
        type: 'LOGOUT',
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip
        }
      }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp.toString(), 12);

    await prisma.passwordResetOTP.create({
      data: {
        userId: user.id,
        otp: hashedOTP,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    // In a real application, send the OTP via email
    // For development, we'll just return it
    res.json({
      message: 'Password reset OTP has been sent',
      otp // Remove this in production
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const resetOTP = await prisma.passwordResetOTP.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!resetOTP || !(await bcrypt.compare(otp.toString(), resetOTP.otp))) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetOTP.update({
        where: { id: resetOTP.id },
        data: { used: true }
      }),
      prisma.userActivity.create({
        data: {
          userId: user.id,
          type: 'PASSWORD_RESET',
          metadata: {
            userAgent: req.headers['user-agent'],
            ip: req.ip
          }
        }
      })
    ]);

    // Invalidate all sessions for security
    await SessionManager.invalidateOtherSessions(user.id);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};
