const express = require('express');
const router = express.Router();
const { getUsers } = require('../queries.js');
router.route('/:id').get(getUsers);

module.exports = router;
