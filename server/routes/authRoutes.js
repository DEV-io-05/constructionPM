import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { register, login, requestPasswordReset, resetPassword, refreshToken, logout } from '../controllers/authController.js';
import { authLimiters } from '../utils/rateLimiter.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Too many registration attempts
 */
router.post('/register', 
  authLimiters.register,  // Changed from authLimiters.auth
  validate(schemas.register),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', 
  authLimiters.login,  // Changed from authLimiters.auth
  validate(schemas.login),
  login
);

/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If email exists, OTP has been sent
 *       429:
 *         description: Too many reset attempts
 */
router.post('/request-password-reset',
  authLimiters.passwordReset,  // This one was already correct
  validate(schemas.passwordReset),
  requestPasswordReset
);

/**
 * @swagger
 * /auth/reset-password-otp:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid OTP or password format
 *       404:
 *         description: User not found
 */
router.post('/reset-password-otp',
  authLimiters.otpVerification,
  validate(schemas.resetPasswordWithOTP),
  resetPassword
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', 
  authLimiters.auth,
  validate(schemas.refreshToken),
  refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and revoke refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post('/logout', 
  verifyToken,
  validate(schemas.refreshToken),
  logout
);

/**
 * Error handling for this router
 */
router.use((err, req, res, next) => {
  console.error('Auth route error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Authentication error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default router;
