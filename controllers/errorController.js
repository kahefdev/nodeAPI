const AppError = require('../utils/AppError.js');

handleCastErrorDB = (err) => {
  const message = `Invalid erro ${err.path} is ${err.value}`;
  return new AppError(message, 400);
};

handleValidationErrorDB = (err) => {
  let error = Object.values(err.errors).map((el) => el.message);
  message = `Invalid input data. ${error.join('. ')}`;

  return new AppError(message, 400);
};

handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value : ${value} detected, please use another value`;
  return new AppError(message, 400);
};

sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('💥', err, '💥');

    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong.....',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('Global error handler invoked');

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'castError') error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateErrorDB(error);

    if (err.name === 'validationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
