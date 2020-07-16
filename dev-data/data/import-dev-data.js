const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./../../model/reviewModel');
dotenv.config({ path: `../../config.env` });

//Hosting database locally!

let DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Hosting database locally
// let DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log(err);
  });

const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importDat = async () => {
  try {
    await Review.create(review);
    console.log('Data Successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete all data from collection

const deleteData = async () => {
  try {
    await Review.deleteMany();
    console.log('Data Deleted Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importDat();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('invalid option choosen');
  process.exit();
}
