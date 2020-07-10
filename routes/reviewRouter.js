const express = require('express');
const {createReview,getReview} = require('../controllers/reviewController')
const router = express.Router();

router.route('/').post(createReview).get(getReview);

module.exports = router;
