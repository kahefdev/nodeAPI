const fs = require('fs');
const Tour = require('../model/toursModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  test() {
    console.log(this.query, this.queryString);
  }
}

const features = new APIfeatures('Sample Query', 'Sample QueryString');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'invalid body'
//     });
//   }
//   next();
// };

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

exports.getAllTours = async (req, res) => {
  try {
    //Filter 1
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    let queryObj = { ...req.query };
    console.log(queryObj);
    //Delete fields from query for filtering
    excludeFields.forEach((el) => delete queryObj[el]);
    //Advance filtering, adding gte,lte and other values
    let updatedQuerey = JSON.stringify(queryObj);
    updatedQuerey = updatedQuerey.replace(
      /\b(lte|gte)\b/g,
      (value) => `$${value}`
    );

    updatedQuerey = JSON.parse(updatedQuerey);
    let query = Tour.find(updatedQuerey);
    // console.log(req.query);
    // if (req.query.sort) {
    //   querey = querey.sort(req.query.sort);
    // }
    // Chaining Sorting to the initial query
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-price');
    }
    //Chaining Limiting the number of fields to send as response or projecting!
    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      querey = query.select(fields);
    } else {
      query = query.select('--v');
    }

    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 10;
    let skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      let nod = await Tour.countDocuments();
      if (nod <= skip) {
        throw error;
      }
    }

    const tours = await query;

    // let newQuerey = { ...req.query };
    //one way
    // const tours = await Tour.find({duration:5});
    //second way
    // const tours = await Tour.find().where('duration').equals(5);
    // let updatedTours = tours.filter(
    //   (val) => val.duration === req.query.duration * 1
    // );
    // console.log(updatedTours);
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
      data: 'Error updating',
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
