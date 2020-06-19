const express = require('express');
const app = express();
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError.js');
const morgan = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const expressMongoSanitize = require('express-mongo-sanitize');
app.use(helmet());
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString;

  next();
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try in an hour',
});

// app.use(morgan('dev'));
app.use(morgan('dev'));
app.use('/api', limiter);
app.use(express.static(`${__dirname}/public/`));
app.use(express.json({ limit: '10kb' }));
app.use(expressMongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage'],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed request',
  //   message: `Cant find url ${req.originalUrl}`,
  // });

  // const err = new Error(`Cant find url ${req.originalUrl}`);
  // err.status = 'Fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Cant find url ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

// const { getUsers } = require('./queries.js');
// const lptRouter = require('./routes/lptRouter.js');
// const { pracNode } = require('./controllers/pracNode.js');
// const pgRouter = require('./routes/pgRouter.js');
// const industryRouter = require('./routes/industryRouter.js');
// const { getOverview } = require('./controllers/lptController');
// app.get('/overview', getOverview);
// app.get('/node', pracNode);
// app.use('/lpt', lptRouter);
// app.use('/industry', industryRouter);
// app.use('/dvdrental/users', pgRouter);
// app.get('/users/:id', getUsers);
