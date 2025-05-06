import { AppError } from './errorHandler.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

class SessionManager {
  static async createSession(userId, refreshToken, req) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    
    return prisma.session.create({
      data: {
        userId,
        refreshToken,
        userAgent,
        ip,
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });
  }

  static async getSession(sessionId) {
    return prisma.session.findUnique({
      where: { id: sessionId }
    });
  }

  static async getUserSessions(userId) {
    return prisma.session.findMany({
      where: { 
        userId,
        expiresAt: { gt: new Date() }
      },
      orderBy: { lastActivity: 'desc' },
      select: {
        id: true,
        userAgent: true,
        ip: true,
        lastActivity: true,
        expiresAt: true
      }
    });
  }

  static async updateSessionActivity(refreshToken) {
    const session = await prisma.session.findFirst({
      where: { refreshToken }
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    return prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });
  }

  static async invalidateSession(refreshToken, userId) {
    return prisma.session.deleteMany({
      where: {
        refreshToken,
        userId
      }
    });
  }

  static async revokeAllExceptCurrent(userId, currentToken) {
    return prisma.session.deleteMany({
      where: {
        userId,
        NOT: {
          refreshToken: currentToken
        }
      }
    });
  }

  static async invalidateOtherSessions(userId) {
    return prisma.session.deleteMany({
      where: { userId }
    });
  }

  static async cleanupExpiredSessions() {
    return prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}

export default SessionManager;