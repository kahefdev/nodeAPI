const Tour = require('../model/toursModel');
const APIfeatures = require('../utils/APIfeatures.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
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

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      message: 'error',
      data: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  let { id } = req.params;

  await Tour.findByIdAndDelete(id);

  if (!tours) return next(new AppError('Tour not found', 404));

  res.status(204);
};

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

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: newTour,
  });
});
