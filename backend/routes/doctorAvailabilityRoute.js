const express = require('express');
const doctorAvailabilityController = require('../controllers/doctorAvailabilityController');
const router = express.Router();


router.get('/', doctorAvailabilityController.getAvailabilitySlots);
router.get('/:id', doctorAvailabilityController.getAvailabilitySlotsById);
router.get('/day/:day', doctorAvailabilityController.getAvailabilitySlotsByDay);
router.get('/doctor/:id', doctorAvailabilityController.getAvailabilitySlotsByDocId);
router.get('/room/:roomNo', doctorAvailabilityController.getAvailabilitySlotsByRoomNo);
router.post('/insert-slot', doctorAvailabilityController.insertAvailabilitySlot);
router.put('/:id', doctorAvailabilityController.updateAvailabilitySlot);

module.exports = router;