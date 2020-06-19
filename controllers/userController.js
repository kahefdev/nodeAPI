const User = require('../model/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');

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

const filterObj = (dataObj, filterObj) => {
  let filteredObj = {};
  console.log(Object.keys(dataObj));
  Object.keys(dataObj).forEach((el) => {
    console.log(el);
    if (filterObj.includes(el)) {
      console.log(el);
      filteredObj[el] = dataObj[el];
    }
  });
  console.log(filteredObj);
  return filteredObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log('Delete Function Invoked');
  console.log(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({ status: 'Success', message: null });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.body.password || req.body.connfirmPassword)
    return next(
      new AppError('Password cannot be updated, something went wrong', 400)
    );

  let userData = filterObj(req.body, ['name', 'email']);
  console.log(userData);
  let userUpdated = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'Success', data: userUpdated });

  // res.json(userUpdated);
});
