const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUserId,
  updateUser
} = require('../controllers/userController.js');
const router = express.Router();
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUserId)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
