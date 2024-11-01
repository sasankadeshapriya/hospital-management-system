const express = require('express');
const patientsController = require('../controllers/patientsController');
const router = express.Router();

router.get('/patients', patientsController.getPatients);
router.get('/patients/:id', patientsController.getPatientsByID);

module.exports = router;