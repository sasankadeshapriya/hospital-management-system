const express = require('express');
const labTestController = require('../controllers/labTestsController');
const router = express.Router();

router.post('/add-lab-test', labTestController.addLabTest)
router.get('/', labTestController.getLabTests);
router.get('/:id', labTestController.getLabTestByID);
router.put('/:id',labTestController.updateLabTest);
router.delete('/:id', labTestController.deleteLabTest);


module.exports = router;