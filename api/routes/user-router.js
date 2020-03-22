const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
router
  .route('/')
  .get(userController.getAll)
  .post(userController.createUser);
module.exports = router;
