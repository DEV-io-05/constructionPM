import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Server } from 'socket.io';
import { createServer } from 'http';
import pkg from '@prisma/client';
import { handleError } from './utils/errorHandler.js';
import { configureSwagger } from './config/swagger.js';
import { apiLimiters } from './utils/rateLimiter.js';
import { setupSocket } from './events/socket.js';
import { setupCleanupTasks } from './utils/cleanupTasks.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import userRoutes from './routes/user.js';
const { PrismaClient } = pkg;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiters.standard);

// API Documentation
configureSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

// Socket.io setup
setupSocket(io);

// Error handling
app.use(handleError);

// Cleanup tasks
setupCleanupTasks();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Starting graceful shutdown...');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
