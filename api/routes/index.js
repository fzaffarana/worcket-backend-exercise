const express = require('express');
const httpStatus = require('http-status');
const funnelRoute = require('./funnel');

const router = express.Router();

// Healthcheck
router.get('/healthcheck', (req, res) => res.status(httpStatus.OK).json({ status: 'OK' }));

// Api routes
router.use('/funnel', funnelRoute);

module.exports = router;
