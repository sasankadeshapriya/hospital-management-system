const express = require('express');
const patientController = require('../controllers/patientsController');
const router = express.Router();

router.get('/patients', patientController.getPatients);

module.exports = router;