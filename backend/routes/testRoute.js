const express = require('express');
const testController = require('../controllers/testController');
const router = express.Router();

router.get('/demo', testController.getDemoData);

module.exports = router;