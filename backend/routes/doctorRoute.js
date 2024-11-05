const express = require('express');
const doctorController = require('../controllers/doctorController');
const router = express.Router();

router
    .get('/', doctorController.getDoctors)
    .get('/:id', doctorController.getDoctorById);

module.exports = router;