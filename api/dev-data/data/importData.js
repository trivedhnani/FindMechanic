const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Job = require('../../models/jobs-model');
const Review = require('../../models/review-model');
console.log(process.env);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`), 'UTF-8');
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/jobs.json`), 'UTF-8');
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'UTF-8')
);
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
    const usersResp = await User.create(users);
    const jobsResp = await Job.create(jobs);
    const reviewResp = await Review.create(reviews);
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
    await Job.deleteMany();
    await Review.deleteMany();
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
