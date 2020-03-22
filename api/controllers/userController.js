const User = require('../models/user-model');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
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
