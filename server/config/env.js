const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS'
];

const optionalEnvVars = {
  NODE_ENV: 'development',
  SMTP_SECURE: 'false',
  OTP_EXPIRY_MINUTES: '10',
  PASSWORD_RESET_WINDOW_HOURS: '1'
};

function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n` +
      'Please check your .env file and provide all required variables.'
    );
  }

  // Set default values for optional variables
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });

  // Validate numeric values
  if (isNaN(parseInt(process.env.PORT))) {
    throw new Error('PORT must be a number');
  }

  if (isNaN(parseInt(process.env.SMTP_PORT))) {
    throw new Error('SMTP_PORT must be a number');
  }

  if (isNaN(parseInt(process.env.OTP_EXPIRY_MINUTES))) {
    throw new Error('OTP_EXPIRY_MINUTES must be a number');
  }

  // Convert string boolean to actual boolean
  process.env.SMTP_SECURE = process.env.SMTP_SECURE === 'true';

  return {
    port: parseInt(process.env.PORT),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM
    },
    otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES),
    passwordResetWindowHours: parseInt(process.env.PASSWORD_RESET_WINDOW_HOURS),
    isDevelopment: process.env.NODE_ENV === 'development'
  };
}

module.exports = validateEnv;