const Review = require('../models/review-model');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
exports.getReviews = catchAsync(async (req, res, next) => {
  const filterObj = req.params.mechId ? { mechanic: req.params.mechId } : {};
  const reviews = await new ApiFeatures(Review.find(filterObj), req.query)
    .filter()
    .sort()
    .fields()
    .limit()
    .query.populate({
      path: 'job',
      select: 'vehicle description'
    })
    .populate({
      path: 'mechanic',
      select: 'id name email'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      review
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
exports.updateReview = catchAsync(async (req, res, next) => {
  const filteredObj = filterObj(req.body, 'rating', 'review');
  const review = await Review.findByIdAndUpdate(req.params.id, filteredObj, {
    runValidators: true,
    new: true
  });
  if (!review) {
    return next(new AppError(400, 'No document with that id'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
