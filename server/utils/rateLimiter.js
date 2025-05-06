import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Common rate limiter configurations
const createLimiter = (options) => rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: options.windowMs,
  max: options.max,
  message: options.message,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP and optional identifier for rate limit key
    return `${req.ip}:${options.identifier || ''}`;
  },
  skip: (req) => {
    // Skip rate limiting for whitelisted IPs (if configured)
    const whitelistedIPs = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
    return whitelistedIPs.includes(req.ip);
  }
});

// Authentication rate limiters
export const authLimiters = {
  login: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    identifier: 'login'
  }),

  register: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registration attempts
    message: { message: 'Too many registration attempts. Please try again after 1 hour.' },
    identifier: 'register'
  }),

  passwordReset: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 reset attempts
    message: { message: 'Too many password reset attempts. Please try again after 1 hour.' },
    identifier: 'reset'
  }),

  otpVerification: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 OTP verification attempts
    message: { message: 'Too many OTP verification attempts. Please try again after 15 minutes.' },
    identifier: 'otp'
  }),

  auth: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts
    message: { message: 'Too many auth attempts. Please try again after 1 hour.' },
    identifier: 'auth'
  })
};

// API rate limiters
export const apiLimiters = {
  standard: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { message: 'Too many requests. Please try again later.' }
  }),

  sensitive: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 requests per window
    message: { message: 'Rate limit exceeded for sensitive operations.' }
  })
};

// Export redis client for use in other modules
export const redisStore = new RedisStore({
  sendCommand: (...args) => redisClient.sendCommand(args),
});

export { redisClient };