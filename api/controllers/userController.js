const User = require('../models/user-model');
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
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});
