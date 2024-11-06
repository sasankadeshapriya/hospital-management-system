const express = require('express');
const userAccountController = require('../controllers/userAccountController');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename with original extension
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });

router.post('/', userAccountController.createUserAccount);
router.delete('/:userId', userAccountController.deleteUserAccount);
router.put('/:userId', userAccountController.updateUserAccount);
router.put('/photo/:userId', upload.single('Photo'), userAccountController.updateUserPhoto);
router
    .get('/non-doctor/:userId', userAccountController.getNonDoctorUserDetails)
    .get('/doctor/:userId', authenticateToken, authorizeRole(["Doctor", "Admin"]), userAccountController.getDoctorUserDetails)
    .get('/non-doctors', userAccountController.getAllNonDoctorUsers);

module.exports = router;