const express = require('express');
const medicalHistoryController = require('../controllers/medicalHistoryController');
const router = express.Router();

router.get('/:id', medicalHistoryController.getMedicalHistoryByPatientID);
router.post('/add-mh/patient/:id', medicalHistoryController.insertMedicalHistoryByPatientId);
router.put('/update-mh/patient/:id', medicalHistoryController.updateMedicalHistoryByPatientId);

module.exports = router;