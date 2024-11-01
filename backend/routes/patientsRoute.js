const express = require('express');
const patientsController = require('../controllers/patientsController');
const router = express.Router();

router.get('/', patientsController.getPatients);
router.get('/:id', patientsController.getPatientsByID);
router.put('/:id', patientsController.updatePatient);
router.post('/add-patient', patientsController.addPatient);
router.delete('/:id', patientsController.deletePatient)

module.exports = router;