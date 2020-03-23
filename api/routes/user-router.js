const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.post(
  '/createUser',
  authController.protect,
  authController.restrictTo('admin'),
  userController.createUser
);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAll
  )
  .post(userController.createUser);
router.route('/:id').get(userController.getUser);
module.exports = router;
