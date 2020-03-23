const AppError = require('../utils/appError');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateKeyDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTTokenExpiredError(error);
    sendErrProd(error, res);
  }
};
const sendErrDev = (err, res) => {
  //   console.log(process.env);
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    stack: err.stack,
    message: err.message
  });
};
const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(400, message);
};
const handleDuplicateKeyDB = err => {
  const message = `Duplicate field value: ${
    err.errmsg.match(/"(.*?)"/)[0]
  }. Please try to use another one!`;
  return new AppError(400, message);
};
const handleValidationError = err => {
  const value = Object.values(err.errors)
    .map(obj => obj.message)
    .join('. ');
  const message = `Invalid input data.${value} `;
  return new AppError(400, message);
};
const handleJWTError = err =>
  new AppError(401, 'Invalid token. Please try again');
const handleJWTTokenExpiredError = err =>
  new AppError(401, 'Your Token has Expired');
