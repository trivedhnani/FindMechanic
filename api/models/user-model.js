const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have name']
    },
    email: {
      type: String,
      required: [true, 'A user must have a valid email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'A user must have password']
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Passwords should be confirmed'],
      validate: {
        validator: function(val) {
          return this.passwordConfirm === this.password;
        },
        message: 'The passwords should match'
      }
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
const User = new mongoose.model('User', userSchema);
module.exports = User;
