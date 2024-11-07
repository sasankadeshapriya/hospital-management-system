const express = require('express');
const adminDashboardController = require('../controllers/adminDashboardController');
const router = express.Router();

router.get('/dashboard-stats', adminDashboardController.getDashboardStatistics);


module.exports = router;
