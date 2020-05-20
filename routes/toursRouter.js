const express = require('express');
const router = express.Router();
const {
  getAllTours,
  addTour,
  getTourById,
  updateTour,
  deleteTour,
  top5Alising,
  cheapestAlising,
  getTourStats,
} = require('../controllers/tourController.js');

// router.param('id', checkID);

router.route('/top-5-tours').get(top5Alising, getAllTours);

router.route('/cheapest').get(cheapestAlising, getAllTours);
router.route('/stats/:year').get(getTourStats);
router.route('/').get(getAllTours).post(addTour);

router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
