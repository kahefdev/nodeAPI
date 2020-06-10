const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const { promisify } = require('util');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let { name, email, password, passwordConfirm } = req.body;
  let createdUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  //The token header is created automatically
  let token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ status: 'Success', data: createdUser, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }
  let user = await User.findOne({ email }).select('+password');
  console.log(await user.correctPass(password, user.password));
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError('Invalid username or password', 400));
  }

  let token = generateToken(user._id);
  res.status(200).json({ status: 'success', token });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization)
    return next(new AppError('Something went wrong, please login', 401));
  let token = req.headers.authorization.split(' ');
  console.log(token[1]);

  let decode = promisify(jwt.verify)(token[1], process.env.JWT_SECRET);

  next();
});
