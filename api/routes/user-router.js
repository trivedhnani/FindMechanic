const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    userController.getAll
  )
  .post(userController.createUser);
router.route('/:id').get(userController.getUser);
module.exports = router;
