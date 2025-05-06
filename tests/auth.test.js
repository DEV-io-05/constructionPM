const request = require('supertest');
const app = require('../server');
const { prisma } = require('./setup');
const bcrypt = require('bcrypt');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Test123!@#',
      name: 'Test User'
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body.user).toHaveProperty('email', validUser.email);
      expect(res.body.user).toHaveProperty('name', validUser.name);
      expect(res.body.user).toHaveProperty('accountNo');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should validate password requirements', async () => {
      const weakPassword = { ...validUser, password: '123' };
      const res = await request(app)
        .post('/api/auth/register')
        .send(weakPassword);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/password.*at least 8 characters/i);
    });

    it('should prevent duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/email already registered/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('Test123!@#', 12);
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          accountNo: 'USR123456',
          role: ['USER'],
          isActive: true
        }
      });
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should respect rate limiting', async () => {
      // Make 6 login attempts (exceeding the 5 per 15min limit)
      for (let i = 0; i < 6; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });

        if (i < 5) {
          expect(res.status).toBe(401);
        } else {
          expect(res.status).toBe(429); // Too Many Requests
          expect(res.body.message).toMatch(/too many.*attempts/i);
        }
      }
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let refreshToken;

    beforeEach(async () => {
      // Create user and get refresh token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      refreshToken = loginRes.body.refreshToken;
    });

    it('should issue new access token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should reject invalid refresh tokens', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/invalid.*token/i);
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      // Login to get tokens
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      accessToken = loginRes.body.accessToken;
      refreshToken = loginRes.body.refreshToken;
    });

    it('should successfully logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/logged out/i);

      // Verify refresh token is revoked
      const refreshRes = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });

      expect(refreshRes.status).toBe(403);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });

      expect(res.status).toBe(401);
    });
  });

  describe('Password Reset Flow', () => {
    let user;
    let otp;

    beforeEach(async () => {
      // Create test user
      user = await prisma.user.create({
        data: {
          email: 'reset@example.com',
          password: await bcrypt.hash('OldPass123!@#', 12),
          name: 'Reset Test',
          accountNo: 'USR654321',
          role: ['USER'],
          isActive: true
        }
      });
    });

    it('should handle complete password reset flow', async () => {
      // Request password reset
      const requestRes = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: user.email });

      expect(requestRes.status).toBe(200);

      // Get OTP from database (in real app this would be sent via email)
      const otpRecord = await prisma.passwordResetOTP.findFirst({
        where: { userId: user.id, used: false }
      });
      expect(otpRecord).toBeTruthy();
      otp = otpRecord.otp;

      // Reset password using OTP
      const resetRes = await request(app)
        .post('/api/auth/reset-password-otp')
        .send({
          email: user.email,
          otp: otp,
          newPassword: 'NewPass123!@#'
        });

      expect(resetRes.status).toBe(200);
      expect(resetRes.body.message).toMatch(/password updated/i);

      // Verify new password works
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'NewPass123!@#'
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty('accessToken');
    });

    it('should handle rate limiting for password reset requests', async () => {
      // Make multiple password reset requests
      for (let i = 0; i < 4; i++) {
        const res = await request(app)
          .post('/api/auth/request-password-reset')
          .send({ email: user.email });

        if (i < 3) {
          expect(res.status).toBe(200);
        } else {
          expect(res.status).toBe(429);
          expect(res.body.message).toMatch(/too many.*attempts/i);
        }
      }
    });
  });
});