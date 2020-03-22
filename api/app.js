const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/user-router');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// To use req.body
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Serves static files
app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
//   res.send('Hello world');
// });
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  next(new AppError(404, message));
});
app.use(globalErrorHandler);
module.exports = app;
