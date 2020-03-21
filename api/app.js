const express = require('express');
const app = express();
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan);
}
app.use((req, res, next) => {
  res.send('Hello world');
});
module.exports = app;
