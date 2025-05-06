/**
 * Socket.IO Event Handler
 * Menangani semua real-time events dan connections
 */

import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Store active connections
const activeConnections = new Map();

// Singleton instance untuk Socket.IO
let ioInstance;

/**
 * Inisialisasi Socket.IO server
 * @param {Object} server - HTTP/HTTPS server instance
 * @returns {Object} Socket.IO server instance
 */
export async function initSocket(server) {
  const { Server } = await import('socket.io');
  
  // Konfigurasi Socket.IO dengan CORS
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : '*',
      methods: ['GET', 'POST']
    }
  });

  setupSocket(io);

  ioInstance = io;
  return io;
}

/**
 * Initialize Socket.IO server with authentication
 * @param {import('socket.io').Server} io - Socket.IO server instance
 */
export function setupSocket(io) {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      // Attach user data to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`🔌 [Socket] User connected: ${socket.user.email} (${userId})`);

    // Store connection
    if (!activeConnections.has(userId)) {
      activeConnections.set(userId, new Set());
    }
    activeConnections.get(userId).add(socket.id);

    // Handle login notifications
    socket.on('login-notification', async (data) => {
      try {
        // Log login event
        await prisma.userActivity.create({
          data: {
            userId: socket.user.id,
            type: 'LOGIN',
            metadata: {
              socketId: socket.id,
              userAgent: socket.handshake.headers['user-agent']
            }
          }
        });

        // Notify other devices of the same user
        const userSockets = activeConnections.get(userId) || new Set();
        userSockets.forEach(socketId => {
          if (socketId !== socket.id) {
            io.to(socketId).emit('account-login', {
              message: 'Your account was logged in from another device',
              timestamp: new Date()
            });
          }
        });

        // Broadcast to relevant users (e.g., admins)
        socket.broadcast.emit('user-activity', {
          type: 'login',
          user: {
            email: socket.user.email,
            id: socket.user.id
          },
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Login notification error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
      io.emit('new-message', {
        ...data,
        user: {
          email: socket.user.email,
          id: socket.user.id
        },
        timestamp: new Date()
      });
    });

    // Handle user activity status
    socket.on('status-change', (status) => {
      socket.broadcast.emit('user-status', {
        userId: socket.user.id,
        status,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ [Socket] User disconnected: ${socket.user.email} (${userId})`);
      
      try {
        // Remove socket from active connections
        const userSockets = activeConnections.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            activeConnections.delete(userId);
          }
        }

        // Log disconnect event
        await prisma.userActivity.create({
          data: {
            userId: socket.user.id,
            type: 'LOGOUT',
            metadata: {
              socketId: socket.id,
              reason: 'disconnect'
            }
          }
        });

        // Notify relevant users
        socket.broadcast.emit('user-activity', {
          type: 'logout',
          user: {
            email: socket.user.email,
            id: socket.user.id
          },
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Disconnect handling error:', error);
      }
    });
  });

  return io;
}

// Utility functions for connection management
export const connectionManager = {
  /**
   * Get all active connections for a user
   * @param {string} userId - User ID
   * @returns {Set<string>} Set of socket IDs
   */
  getUserConnections(userId) {
    return activeConnections.get(userId) || new Set();
  },

  /**
   * Check if user is online
   * @param {string} userId - User ID
   * @returns {boolean} Whether user has any active connections
   */
  isUserOnline(userId) {
    const connections = activeConnections.get(userId);
    return connections ? connections.size > 0 : false;
  },

  /**
   * Get all online users
   * @returns {string[]} Array of online user IDs
   */
  getOnlineUsers() {
    return Array.from(activeConnections.keys());
  },

  /**
   * Disconnect all sockets for a user
   * @param {import('socket.io').Server} io - Socket.IO server instance
   * @param {string} userId - User ID
   */
  disconnectUser(io, userId) {
    const sockets = activeConnections.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
      });
      activeConnections.delete(userId);
    }
  }
};

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO server instance
 * @throws {Error} If Socket.IO belum diinisialisasi
 */
export function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.IO belum diinisialisasi');
  }
  return ioInstance;
}
