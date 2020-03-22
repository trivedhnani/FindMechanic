const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/user-router');
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
module.exports = app;
