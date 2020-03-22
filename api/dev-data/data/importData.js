const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../../models/user-model');
console.log(process.env);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`), 'UTF-8');
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// Connect to the database
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
// Import data
const importData = async () => {
  try {
    const resp = await User.create(users);
    console.log('Data imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
