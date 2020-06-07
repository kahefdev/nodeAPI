const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUserId,
  updateUser,
} = require('../controllers/userController.js');
const router = express.Router();

router.post('/signup', createUser);
router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

router.route('/:id').get(getUserId).patch(updateUser).delete(deleteUser);

module.exports = router;
