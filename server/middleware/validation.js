import Joi from 'joi';
import { AppError } from '../utils/errorHandler.js';

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    username: Joi.string().alphanum().min(3).max(30).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  passwordReset: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPasswordWithOTP: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
    newPassword: Joi.string().min(8).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
  }),

  updateProfile: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    username: Joi.string().alphanum().min(3).max(30)
  }).min(1)
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return next(new AppError('Validation failed', 400, validationErrors));
    }

    next();
  };
};

export { validate, schemas };