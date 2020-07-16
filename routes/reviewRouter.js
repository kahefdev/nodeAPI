const express = require('express');
const {createReview,getReview, updateReviw} = require('../controllers/reviewController');
const {oneReview,deleteReview} = require('../controllers/reviewController')
const router = express.Router();

router.route('/').post(createReview).get(getReview);
router.route('/:id').delete(deleteReview).get(oneReview).patch(updateReviw);

module.exports = router;
