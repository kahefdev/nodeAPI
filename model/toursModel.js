const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name is required'],
      unique: true,
      minlength: [10, 'minimum length should be 10 characters'],
      maxlength: [40, 'minimum length should be 40 characters'],
      //Using Validator JS to validate fields
      validate: [validator.default.isEmail, 'The name cannot be with spaces'],
    },
    secret: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    //Buidling custom validator
    priceDiscount: {
      type: Number,
      //This only points to current document
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'The price cannot be greater then ({VALUE})',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'A tror mush have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'outside value inserterd',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1.0,
      max: 5.0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      required: [true, 'A tour must have a duration'],
      type: Number,
    },
    discount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Group size is required'],
    },
    date: String,
    time: String,
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
