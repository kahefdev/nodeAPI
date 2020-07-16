const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUserId,
  updateUser,
  updateMe,
  deleteMe,
  getMe,
  getUser
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
router.use(protect);
router.route('/me').get(getMe,getUser);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateUser);
router.delete('/deleteMe', protect, deleteMe);



router.route('/').get(protect, getAllUsers).patch(updateUser);
router.route('/:id').get(getUserId).patch(updateUser);

module.exports = router;
