const express = require('express');
const router = express.Router();
const { getOverview, getTour } = require('../controllers/viewsController');

router.get('/overview', getOverview);
router.get('/tour', getTour);

module.exports = router;
