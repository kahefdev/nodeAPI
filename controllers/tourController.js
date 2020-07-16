const Tour = require('../model/toursModel');
const APIfeatures = require('../utils/APIfeatures.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const Factory = require("../controllers/handlerFactory");


exports.updateTour = Factory.updateOne(Tour);
exports.deleteTour = Factory.deleteOne(Tour);
exports.addTour = Factory.createOne(Tour);

exports.getAllTours = Factory.getAll(Tour)

exports.getTourById = Factory.getOne(Tour);





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
  res.status(200).json({
    message: 'Success',
    data: { stats },
  });
});





