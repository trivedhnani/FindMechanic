const Review = require('../models/review-model');
const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// Can handle both /reviews and staff/:mechId/reviews
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.deleteReview
  );
module.exports = router;
