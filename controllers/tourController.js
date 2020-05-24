const fs = require('fs');
const Tour = require('../model/toursModel');
const APIfeatures = require('../utils/APIfeatures.js');

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'Error',
      data: 'Bad Request',
    });
  }
};

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

exports.getTourById = async (req, res) => {
  console.log(req.params.id);
  try {
    const tours = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      data: 'Error finding',
    });
  }
};

exports.checkID = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'invalid ID',
    });
  }
  console.log(val);
  next();
};

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

// exports.updateTour = (req, res) => {
//   console.log(req.params.id);
//   if (req.params.id) {
//     let tour = tours.find((value) => value.id === req.params.id * 1);
//     for (let value in req.body) {
//       tour[value] = req.body[value];
//     }
//     let newTours = tours.map((value) => {
//       if (value.id !== req.params.id * 1) return value;
//       else {
//         return tour;
//       }
//     });
//     console.log(newTours);

//     // console.log(req.body);
//     fs.writeFile(
//       `${__dirname}/dev-data/data/tours-simple.json`,
//       JSON.stringify(newTours),
//       (err) => {
//         res.status(201).json({
//           status: 'success',
//           entries: tours.length,
//           data: {
//             tours: newTours,
//           },
//         });
//       }
//     );
//   }
// };

exports.deleteTour = async (req, res) => {
  let { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(400);
  } catch (error) {
    res.status(404).json({
      message: 'eror',
      data: 'error deleting',
    });
  }
};

exports.getTourStats = async (req, res) => {
  let year = req.params.year * 1;
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Bad request',
      data: error,
    });
  }
};

exports.addTour = async (req, res) => {
  console.log(req.body);
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      data: err,
    });
  }
};
