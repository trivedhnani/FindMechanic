const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const userRouter = require('./routes/user-router');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// helmet for security HTTP headers
app.use(helmet());
// Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Try again in an hour!'
});
app.use('/api', limiter);
// To use req.body
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL injection and XSS attacks
app.use(mongoSanitize());
app.use(xss());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration']
  })
);
// Serves static files
app.use(express.static(`${__dirname}/public`));

// Routers
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  next(new AppError(404, message));
});
app.use(globalErrorHandler);
module.exports = app;
