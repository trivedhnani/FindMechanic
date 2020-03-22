const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
      required: [true, 'A user must have password'],
      minlength: [4, 'password should be atleast 4 charaters'],
      select: false
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
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.checkPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
  }
};
userSchema.methods.changedPasswordAfter = async function(JWTissuedAt) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTissuedAt < changedTime;
  }
  return false;
};
const User = new mongoose.model('User', userSchema);
module.exports = User;
