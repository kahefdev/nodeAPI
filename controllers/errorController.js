module.exports = (err, req, res, next) => {
  console.log('Global error handler invoked');

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Fail';

  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
  });
};
