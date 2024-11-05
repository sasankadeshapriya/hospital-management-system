const express = require('express');
const userAccountController = require('../controllers/userAccountController');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', userAccountController.createUserAccount);
router.delete('/:userId', userAccountController.deleteUserAccount);
router.put('/:userId', userAccountController.updateUserAccount);
router
    .get('/non-doctor/:userId', userAccountController.getNonDoctorUserDetails)
    .get('/doctor/:userId', authenticateToken, authorizeRole(["Doctor", "Admin"]), userAccountController.getDoctorUserDetails);

module.exports = router;