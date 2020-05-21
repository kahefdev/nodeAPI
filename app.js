const express = require('express');
const app = express();

const morgan = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');
const lptRouter = require('./routes/lptRouter.js');
const industryRouter = require('./routes/industryRouter.js');

const pgRouter = require('./routes/pgRouter.js');

const { pracNode } = require('./controllers/pracNode.js');
const { getOverview } = require('./controllers/lptController');
const { getUsers } = require('./queries.js');
// app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public/`));
app.use(express.json());

app.use((req, res, next) => {
  req.getTime = new Date().toISOString();
  console.log(req.getTime);
  next();
});

app.get('/node', pracNode);
app.use('/lpt', lptRouter);
app.use('/industry', industryRouter);
app.use('/dvdrental/users', pgRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.get('/users/:id', getUsers);
app.get('/overview', getOverview);

module.exports = app;
