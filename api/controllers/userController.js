const User = require('../models/user-model');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  const users = await new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .fields()
    .limit().query;
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError(404, 'No user found with that id'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
const filterValues = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(400, 'Please use /updatePassword route to update password')
    );
  }
  const filterObj = filterValues(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});
