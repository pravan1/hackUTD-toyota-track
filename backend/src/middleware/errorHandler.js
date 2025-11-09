export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error('[ErrorHandler]', err);
  }

  res.status(status).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

