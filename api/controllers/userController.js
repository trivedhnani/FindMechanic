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
