const express = require('express');
const testController = require('../controllers/testController');
const router = express.Router();

router.get('/demo', testController.getPatients);

module.exports = router;