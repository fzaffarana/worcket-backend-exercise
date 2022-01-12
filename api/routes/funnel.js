const express = require('express');
const { getUsersByStep } = require('../controllers/funnel');

const router = express.Router();
router.route('/usersbystep').get(getUsersByStep);

module.exports = router;
