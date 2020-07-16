const Tour = require('../model/toursModel');
const APIfeatures = require('../utils/APIfeatures.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const Factory = require("../controllers/handlerFactory");
exports.getAllTours = catchAsync(async (req, res) => {
console.log(req.query);

  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    entries: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.top5Alising = (req, res, next) => {
  req.query = {
    sort: 'rating price',
    fields: 'name rating price duration',
    limit: '5',
  };
  next();
};

exports.cheapestAlising = (req, res, next) => {
  req.query = {
    sort: 'price',
    fields: 'name price rating duration',
    limit: '5',
  };
  next();
};

exports.getTourById = catchAsync(async (req, res, next) => {
  console.log(req.params.id);

  const tours = await Tour.findById(req.params.id);

  if (!tours) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tours,
  });
});



// exports.deleteTour = async (req, res, next) => {
//   let { id } = req.params;
//   console.log(id);
//   let tour = await Tour.findByIdAndDelete(id);

//   if (!tour) return next(new AppError('Tour not found', 404));

//   res
//     .status(200)
//     .json({ status: 'Success', message: 'User deleted successfully' });
// };

exports.getTourStats = catchAsync(async (req, res) => {
  let year = req.params.year * 1;

  const stats = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { tourStarts: -1 },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 6,
    },
  ]);

  // const stats = await Tour.aggregate([
  //   {
  //     $match: { ratingsAverage: { $gte: 4.5 } },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       avgRating: { $avg: '$ratingsAverage' },
  //       avgPrice: { $avg: '$price' },
  //       minPrice: { $min: '$price' },
  //       maxPrice: { $max: '$price' },
  //     },
  //   },
  // ]);
  res.status(200).json({
    message: 'Success',
    data: { stats },
  });
});

exports.updateTour = Factory.updateOne(Tour);
exports.deleteTour = Factory.deleteOne(Tour);
exports.addTour = Factory.createOne(Tour);
