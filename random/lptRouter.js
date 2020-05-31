const express = require('express');
const router = express.Router();
const { getLpt } = require('../controllers/lptController.js');

router.route('/').get(getLpt);

module.exports = router;
