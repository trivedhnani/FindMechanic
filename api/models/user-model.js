const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name']
  },
  email: {
    type: String,
    required: [true, 'A user must have a valid email']
  },
  password: {
    type: String,
    required: [true, 'A user must have password']
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'mechanic', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  }
});
const User = new mongoose.model('User', userSchema);
module.exports = User;
