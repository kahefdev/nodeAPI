const express = require('express');
const app = express();

const morgan = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRouter');

// app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public/`));
app.use(express.json());

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

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
