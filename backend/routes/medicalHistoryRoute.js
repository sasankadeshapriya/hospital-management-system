const express = require('express');
const medicalHistoryController = require('../controllers/medicalHistoryController');
const router = express.Router();

router.get('/:id', medicalHistoryController.getMedicalHistoryByPatientID);

module.exports = router;