import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Middleware to verify JWT access token
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check if user has required roles
 * @param {string[]} requiredRoles - Array of roles that can access the route
 */
export const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const hasRequiredRole = roles.some(role => 
      req.user.role.includes(role)
    );

    if (!hasRequiredRole) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource or has admin role
 * @param {Function} getResourceUserId - Function to extract resource owner's ID from request
 */
export const isOwnerOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      const resourceUserId = await getResourceUserId(req);
      
      const isAdmin = req.user.role.includes('ADMIN');
      const isOwner = req.user.id === resourceUserId;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ 
          message: 'Access denied. You do not own this resource.' 
        });
      }

      next();
    } catch (err) {
      console.error('Owner check error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
};
