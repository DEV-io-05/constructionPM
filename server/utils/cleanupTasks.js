import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import SessionManager from './sessionManager.js';

const prisma = new PrismaClient();

export const setupCleanupTasks = () => {
  // Run cleanup tasks every hour
  setInterval(async () => {
    try {
      // Clean up expired sessions
      await SessionManager.cleanupExpiredSessions();
      
      // Clean up used/expired OTPs
      await prisma.passwordResetOTP.deleteMany({
        where: {
          OR: [
            { used: true },
            { expiresAt: { lt: new Date() } }
          ]
        }
      });

      // Clean up revoked/expired refresh tokens
      await prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { revoked: true },
            { expiresAt: { lt: new Date() } }
          ]
        }
      });

      console.log('Cleanup tasks completed successfully');
    } catch (error) {
      console.error('Error running cleanup tasks:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
};