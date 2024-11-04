const express = require('express');
const doctorAppointmentsController = require('../controllers/doctorAppointmentsController');
const router = express.Router();

router.get('/', doctorAppointmentsController.getDoctorAppointments);
router.get('/:id', doctorAppointmentsController.getDoctorAppointmentById);
router.get('/doctor/:id', doctorAppointmentsController.getDoctorAppointmentByDocId);
router.get('/patient/:id', doctorAppointmentsController.getDoctorAppointmentByPatientId);
// router.get('/queue/:id', doctorAppointmentsController.getDoctorAppointmentByQueueId);

router.post('/book-appointment', doctorAppointmentsController.insertDoctorAppointment);

module.exports = router;