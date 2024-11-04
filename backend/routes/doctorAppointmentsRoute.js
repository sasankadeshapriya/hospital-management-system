const express = require('express');
const doctorAppointmentsController = require('../controllers/doctorAppointmentsController');
const router = express.Router();

router.get('/', doctorAppointmentsController.getDoctorAppointments);
router.get('/:id', doctorAppointmentsController.getDoctorAppointmentById);
router.get('/doctor/:id', doctorAppointmentsController.getDoctorAppointmentByDocId);
router.get('/patient/:id', doctorAppointmentsController.getDoctorAppointmentByPatientId);
router.get('/queue/:id', doctorAppointmentsController.getDoctorAppointmentByQueueId);

router.put('/update-status/:id', doctorAppointmentsController.updateDoctorAppointmentStatus);
router.post('/book-appointment', doctorAppointmentsController.insertDoctorAppointment);
router.delete('/:id', doctorAppointmentsController.deleteDoctorAppointment);

module.exports = router;