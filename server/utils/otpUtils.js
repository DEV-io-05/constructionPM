import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const generateOTP = () => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getEmailTemplate = (otp) => `...`; // (sama seperti sebelumnya)

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!email || !otp) throw new Error('Email and OTP are required');
    if (!isValidEmail(email)) throw new Error('Invalid email format');

    const emailKey = `email:${email}:lastSent`;
    const now = Date.now();

    if (!globalThis.emailRateLimit) globalThis.emailRateLimit = new Map();
    const lastSent = globalThis.emailRateLimit.get(emailKey) || 0;

    if (now - lastSent < 60000) {
      throw new Error('Please wait before requesting another OTP');
    }

    globalThis.emailRateLimit.set(emailKey, now);

    const info = await transporter.sendMail({
      from: `"CV Ajat Konstruksi" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This code will expire in 10 minutes.`,
      html: getEmailTemplate(otp)
    });

    console.log('Email sent:', info.messageId);
    return true;

  } catch (error) {
    console.error('Email sending failed:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV ONLY] OTP for ${email}: ${otp}`);
    }
    throw error;
  }
};

export const validateOTPFormat = (otp) => /^\d{6}$/.test(otp);
