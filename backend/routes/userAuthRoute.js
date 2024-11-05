const express = require('express');
const userAccountController = require('../controllers/loginController');
const router = express.Router();

router.post('/login', userAccountController.loginUser);
router.post('/logout', userAccountController.logoutUser);


module.exports = router;