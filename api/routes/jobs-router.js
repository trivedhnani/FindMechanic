const express = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');
const router = express.Router();
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'mechanic'),
    jobController.getJobs
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    jobController.setUser,
    jobController.createJob
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    jobController.setUser,
    jobController.updateJob
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    jobController.deleteJob
  );
module.exports = router;
