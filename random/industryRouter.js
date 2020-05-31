const express = require('express');
const router = express.Router();
const { getIndustry } = require('../controllers/lptController.js');

router.route('/').get(getIndustry);

module.exports = router;
