const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const { promisify } = require('util');
const sendEmail = require('../utils/email.js');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let { name, email, password, passwordConfirm, pca, role } = req.body;
  let createdUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    pca,
    role,
  });
  //The token header is created automatically
  let token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ status: 'Success', data: createdUser, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }
  let user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError('Invalid username or password', 400));
  }

  let token = generateToken(user._id);
  res.status(200).json({ status: 'success', token });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Check if authorization token exists
  if (!req.headers.authorization)
    return next(new AppError('Something went wrong, please login', 401));
  let token = req.headers.authorization.split(' ');
  //2. Verify token
  let decode = await promisify(jwt.verify)(token[1], process.env.JWT_SECRET);
  console.log(decode);
  let user = await User.findOne({ _id: decode.id });
  //3. Check if user still exists, was not deleted after token being issued
  if (!user) return next(new AppError('User no longer exists', 401));
  //4)Check if password is chancged aftercs token issued
  if (await user.changedPassword(decode.iat)) {
    return next(new AppError('Password changed,please login again', 401));
  }
  //Grant access to protected route
  req.user = user;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('User not authorized', 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  let { email } = req.body;
  if (!email) return next(new AppError('Email required', 400));

  let user = await User.findOne({ email });
  if (!user) return next(new AppError('User not found', 400));
  let token = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;

  let subject = `Forgot password? `;
  let message = `Please use the link to reset your password \n ${resetURL}`;
  try {
    await sendEmail({ subject, message, email });
    res
      .status(200)
      .json({ status: 'Success', message: 'Token email sent successfully' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.resetTokenCreated = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email, try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on the token provided

  let token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(token);
  let user = await User.findOne({
    passwordResetToken: token,
    resetTokenCreated: { $gt: Date.now() },
  });
  console.log(user);
  //2. check token expiry, users existance, if both true, then change password
  if (!user)
    return next(new AppError('Invalid token or token has expired', 400));
  console.log(req.body);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.resettokencreate = undefined;

  await user.save();

  //3. Update the changedpasswordat property using pre middleware function

  //4. Login user in, send jwt

  token = generateToken(user._id);

  res.status(200).json({ status: 'Success', token });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  let { currentPassword, newPassword, confirmPassword } = req.body;
  let token = req.headers.authorization.split(' ');
  let decode = await promisify(jwt.verify)(token[1], process.env.JWT_SECRET);
  //1. Get user from collection
  let user = await User.findOne({ _id: decode.id }).select('+password');
  //2. Check if user exists and if password match

  if (!user || !(await user.correctPass(currentPassword, user.password)))
    return next(new AppError('Something went wrong, please retry'), 400);
  //3. Update the password
  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();
  //4. Set token to null, log user out.
  // req.headers.authorization = null;
  console.log(user);
  newToken = generateToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'password cahnged successfullt',
    token: newToken,
  });
});
