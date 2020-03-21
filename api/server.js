const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
