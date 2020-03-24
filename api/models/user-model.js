const mongoose = require('mongoose');
const crypto = require('crypto');
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
    // passwordConfirm: {
    //   type: String,
    //   required: [true, 'Passwords should be confirmed'],
    //   validate: {
    //     validator: function(val) {
    //       return this.passwordConfirm === this.password;
    //     },
    //     message: 'The passwords should match'
    //   }
    // },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'mechanic', 'admin']
    },
    active: {
      type: Boolean,
      default: true
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id'
});
userSchema.virtual('jobs', {
  ref: 'Job',
  foreignField: 'user',
  localField: '_id'
});
// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password') || this.isNew) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//   }
//   next();
// });
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
userSchema.methods.changedPasswordAfter = function(JWTissuedAt) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTissuedAt < changedTime;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  // We send this token to user
  const resetToken = crypto.randomBytes(32).toString('hex');
  // We have to encrypt the above reset token and store it in database to prevent unauthorized access to these
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = new mongoose.model('User', userSchema);
module.exports = User;
