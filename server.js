const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

let DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

const { PORT } = process.env;
let server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('💥', err, '💥');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('💥', 'uncaught Exception', '💥');
  console.log(err.message);

  server.close(() => {
    process.exit(1);
  });
});
