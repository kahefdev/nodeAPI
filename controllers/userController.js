const User = require('../model/userModel.js');
const catchAsync = require('../utils/catchAsync.js');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  console.log(req.user);
  let usersData = await User.find();
  res.status(200).json({ status: 'Success', data: usersData });
});

exports.getUserId = (req, res) => {
  res.status(500).json({
    status: 'erro',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await User.deleteOne({ email: req.body.email });
  res
    .status(200)
    .json({ status: 'Success', message: 'User Deleted Successfully' });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'erro',
    message: 'This route is not yet defined',
  });
};
