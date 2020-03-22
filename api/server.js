const dotenv = require('dotenv');
process.on('uncaughtException', err => {
  console.log(err.name + ',' + err.message);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT;
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// Options to supress deprecation warnigns
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful');
  });
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', err => {
  console.log(err.name + ',' + err.message);
  console.log('Shutting Down the server');
  server.close(() => {
    process.exit(1);
  });
});
