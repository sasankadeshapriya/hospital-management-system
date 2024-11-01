const express = require('express');
const patientsController = require('../controllers/patientsController');
const router = express.Router();

router.get('/', patientsController.getPatients);
router.get('/:id', patientsController.getPatientsByID);

module.exports = router;