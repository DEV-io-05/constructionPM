export class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message
  }));

  return new AppError('Validation failed', 400, errors);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already exists`;

  return new AppError(message, 400, [{
    field,
    message
  }]);
};

const handleJWTError = () => new AppError('Invalid token', 401);

const handleJWTExpiredError = () => new AppError('Token expired', 401);

export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
      error: err
    });
  } else {
    // Production mode: don't leak error details
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Something went wrong',
      ...(err.errors && { errors: err.errors })
    });
  }
};