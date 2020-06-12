const express = require('express');
const { protect, restrict } = require('../controllers/authController');
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
router.route('/').get(protect, getAllTours).post(addTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(protect, restrict('admin', 'lead-guide'), deleteTour);

module.exports = router;
