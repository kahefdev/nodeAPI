const express = require('express');
const fs = require('fs');
const app = express();
const url = require('url');
const morgan = require('morgan');
// app.use(express.urlencoded({ extended: true }));

//1  Middle ware functions
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  req.getTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

//2 Route Handlers
//To get all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.getTime,
    entries: tours.length,
    data: {
      tours: tours
    }
  });
};

const getTourById = (req, res) => {
  let reqTour = tours.filter(value => value.id === parseInt(req.params.id));

  res.status(200).json({
    status: 'success',
    entries: tours.length,
    data: {
      tours: reqTour
    }
  });
};

const updateTour = (req, res) => {
  console.log(req.params.id);
  if (req.params.id) {
    let tour = tours.find(value => value.id === req.params.id * 1);
    for (let value in req.body) {
      // if (tour[value]) {
      //   console.log(req.body);
      //   // tour[value] = req.body.value;
      // }
      tour[value] = req.body[value];
    }
    let newTours = tours.map(value => {
      if (value.id !== req.params.id * 1) return value;
      else {
        return tour;
      }
    });
    console.log(newTours);

    // console.log(req.body);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(newTours),
      err => {
        res.status(201).json({
          status: 'success',
          entries: tours.length,
          data: {
            tours: newTours
          }
        });
      }
    );
  }
};

const deleteTour = (req, res) => {
  let { id } = req.param;
  res.status(404).json({
    status: 'Removed'
  });
};

const addTour = (req, res) => {
  console.log(req.body);

  // console.log(JSON.parse(JSON.stringify(req.body)));
  // let newTour = JSON.parse(JSON.stringify(req.body));

  let newTour = { id: tours[tours.length - 1].id + 1, ...req.body };
  // let newTour = Object.assign({ id: tours[tours.length - 1].id + 1 }, req.body);
  // let { tourName, duration, location } = req.body;

  // let newTour = {
  //   id: tours.length + 1,
  //   tourName,
  //   duration,
  //   location
  // };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        entries: tours.length,
        data: {
          tours: newTour
        }
      });
    }
  );
};

// app.get('/natours/v1/tours', (req, res) => {
//   let { id } = url.parse(req.url, true).query;
//   if (id) {
//     console.log(typeof id);
//     let newtours = tours.filter(value => {
//       return value.id == = parseInt(id);
//     });
//     console.log(newtours);
//     res.send(newtours);
//   } else {
//     res.status(200).json({
//       status: 'success',
//       entries: tours.length,
//       data: {
//         tours: tours
//       }
//     });
//   }
// });
//3. Routes

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(addTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

//4. Start server
app.listen(3000, () => {
  console.log('server listening on port 3000');
});
