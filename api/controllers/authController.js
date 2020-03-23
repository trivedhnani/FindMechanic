const User = require('../models/user-model');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEMail = require('../utils/emailHandler');
const jwt = require('jsonwebtoken');
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createAndSendToken = (user, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    )
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
    status: 'success',
    user
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createAndSendToken(user, res);
});
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError(400, 'Please enter username and password'));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError(401, 'Invalid username or password'));
  }
  createAndSendToken(user, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError(401, 'Please login to get access'));
  }
  const token = req.headers.authorization.split(' ')[1];
  //   If no callback is supplied as an argument verify function works synchronusly. Promisify and awiat for results
  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const user = await User.findById(id);
  if (!user) {
    return next(
      new AppError(401, 'User belonging to this token does not exist')
    );
  }
  if (await user.changedPasswordAfter(iat)) {
    return next(
      new AppError(
        401,
        'User recently changed password, please login again with new password'
      )
    );
  }
  req.user = user;
  next();
});
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(401, 'You are not authorized to access this route')
    );
  }
  next();
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(400, 'No user found with this email id'));
  }
  //2. create and send reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //   3. send email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const options = {
    email: req.body.email,
    subject: 'Your password reset token',
    message: `Forgot password? please submit a patch request to ${resetUrl}`
  };
  try {
    await sendEMail(options);
    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to mail'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, 'Error sending mail. Try again later'));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.find({
    passwordResetToken: hashedResetToken,
    passwordExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError(400, 'This token is invalid or expired'));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetToken = undefined;
  user.passwordExpires = undefined;
  await user.save();
  createAndSendToken(user, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(
      new AppError(401, 'User belonging to this token does not exist')
    );
  }
  if (!(await user.checkPassword(req.body.password))) {
    return next(new AppError('400', 'Please enter correct password'));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  await user.save();
  createAndSendToken(user, res);
});
