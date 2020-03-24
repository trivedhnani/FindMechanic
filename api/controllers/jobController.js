const Job = require('../models/jobs-model');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
exports.getJobs = catchAsync(async (req, res, next) => {
  const jobs = await new ApiFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .fields()
    .limit()
    .query.populate({
      path: 'review',
      select: 'review rating'
    })
    .populate({
      path: 'mechanic',
      select: 'name email'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs
    }
  });
});
exports.createJob = catchAsync(async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  });
});
const filterObj = (body, ...allowedFields) => {
  const newObj = {};
  Object.keys(body).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = body[el];
    }
  });
  return newObj;
};
exports.updateJob = catchAsync(async (req, res, next) => {
  const filteredObj = filterObj(req.body, 'description', 'vehicle');
  //   Query middleware is not supported for findByIdAndUpdate and findByIdAndDelete use findOneUpdate and findOneAndDelete instead
  const job = await Job.findOneUpdate(req.params.id, filteredObj, {
    runValidators: true,
    new: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  });
});
exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOneAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
