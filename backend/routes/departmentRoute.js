const express = require('express');
const departmentsController = require('../controllers/departmentController');
const router = express.Router();

router.get('/', departmentsController.getDepartmentDetails);
router.get('/:id/doctors', departmentsController.getDoctorsByDepartmentID);
router.post('/add-department', departmentsController.insertDepartment);
router.put('/:id', departmentsController.updateDepartment);
router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;
