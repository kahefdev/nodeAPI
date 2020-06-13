const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUserId,
  updateUser,
} = require('../controllers/userController.js');

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController.js');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', updatePassword);

router
  .route('/')
  .get(protect, getAllUsers)
  .patch(updateUser)
  .delete(deleteUser);

router.route('/:id').get(getUserId).patch(updateUser).delete(deleteUser);

module.exports = router;
