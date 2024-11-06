const db = require('../db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();


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

// Function to create user account with availability based on account type
const createUserAccount = async (req, res) => {
  upload.single('Photo')(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return res.status(400).json({ message: "Image upload failed" });
    }

    try {
      const {
        Name,
        Email,
        Password,
        Address,
        DOB,
        ContactNumber,
        AccountType,
        Specialization,
        Status,
        DOJ,
        Availability
      } = req.body;

      const isActive = req.body.isActive === 'true';
      const DepartmentID = parseInt(req.body.DepartmentID, 10);

      // Check if DepartmentID is a valid number
      if (isNaN(DepartmentID) && AccountType === "Doctor") {
        return res.status(400).json({ message: "Invalid DepartmentID provided for a Doctor account" });
      }

      const Photo = req.file ? `/uploads/${req.file.filename}` : null;

      // Check if email already exists
      const checkEmailSql = "SELECT * FROM UserAccounts WHERE Email = ?";
      db.query(checkEmailSql, [Email], async (err, checkResult) => {
        if (err) {
          console.error("Database error during email check:", err);
          return res.status(500).json({ message: "Something unexpected has occurred" });
        }

        if (checkResult.length > 0) {
          return res.status(409).json({ message: "An account with this email already exists." });
        }

        // Hash the password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const sql = "CALL CreateUserAccountWithAvailability(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          Name,
          Email,
          hashedPassword, // Use the hashed password here
          Address,
          Photo,
          DOB,
          ContactNumber,
          AccountType,
          isActive,
          AccountType === "Doctor" ? Specialization : null,
          AccountType === "Doctor" ? Status : null,
          AccountType === "Doctor" ? DOJ : null,
          AccountType === "Doctor" ? DepartmentID : null,
          AccountType === "Doctor" ? JSON.stringify(Availability) : null
        ];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Something unexpected has occurred" });
          }

          console.log("User account created successfully");
          return res.status(201).json({ message: "User account created successfully", data: result });
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Something unexpected has occurred" });
    }
  });
};

// Function to delete user account after checking if the user is active
const deleteUserAccount = (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Check if the user is active
  const checkUserSql = "SELECT isActive FROM UserAccounts WHERE UserID = ?";
  db.query(checkUserSql, [userId], (err, result) => {
    if (err) {
      console.error("Database error during user check:", err);
      return res.status(500).json({ message: "Something unexpected has occurred" });
    }

    // Check if user exists and is active
    if (result.length === 0 || result[0].isActive === 0) {
      return res.status(404).json({ message: "User not found or already inactive" });
    }

    // Call the DeleteUserAccount stored procedure
    const deleteUserSql = "CALL DeleteUserAccount(?)";
    db.query(deleteUserSql, [userId], (err, deleteResult) => {
      if (err) {
        console.error("Database error during account deletion:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      console.log("User account deactivated successfully");
      return res.status(200).json({ message: "User account deactivated successfully" });
    });
  });
};

// function for update user account
const updateUserAccount = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const {
      Name,
      Password,
      Address,
      DOB,
      ContactNumber,
      AccountType,
      isActive,
      Specialization,
      Status,
      DepartmentID
    } = req.body;

    // Validate user existence and active status before update
    const checkUserSql = "SELECT isActive FROM UserAccounts WHERE UserID = ?";
    db.query(checkUserSql, [userId], async (err, result) => {
      if (err) {
        console.error("Database error during user check:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      if (result.length === 0 || result[0].isActive === 0) {
        return res.status(404).json({ message: "User not found or inactive" });
      }

      // Hash the password if provided
      const hashedPassword = Password ? await bcrypt.hash(Password, 10) : null;

      // Call the stored procedure
      const sql = "CALL EditUserAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        userId,
        Name,
        hashedPassword || result[0].Password, // Use hashed password or keep current
        Address,
        DOB,
        ContactNumber,
        AccountType,
        isActive === 'true',
        AccountType === "Doctor" ? Specialization : null,
        AccountType === "Doctor" ? Status : null,
        AccountType === "Doctor" ? DepartmentID : null
      ];

      db.query(sql, values, (err, updateResult) => {
        if (err) {
          console.error("Database error during account update:", err);
          return res.status(500).json({ message: "Something unexpected has occurred" });
        }

        console.log("User account updated successfully");
        return res.status(200).json({ message: "User account updated successfully", data: updateResult });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Something unexpected has occurred" });
  }
};


// Function to get details for non-doctor users
const getNonDoctorUserDetails = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  const sql = "SELECT * FROM NonDoctorUserDetailsView WHERE UserID = ?";
  db.query(sql, [userId], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: "Non-doctor user not found" });
      }

      const user = result[0];
      const baseURL = process.env.BASE_URL || "http://localhost";

      // Set `Photo` URL with baseURL, use default if `Photo` is null
      user.Photo = user.Photo 
          ? `${baseURL}${user.Photo.startsWith('/uploads') ? user.Photo : `/uploads/${user.Photo}`}`
          : `${baseURL}/uploads/default_pro.png`;

      res.status(200).json(user);
  });
};

// Function to get details for doctor users
const getDoctorUserDetails = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  const sql = "SELECT * FROM DoctorUserDetailsView WHERE UserID = ?";
  db.query(sql, [userId], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: "Doctor user not found" });
      }

      const user = result[0];
      const baseURL = process.env.BASE_URL || "http://localhost";

      // Set `Photo` URL with baseURL, use default if `Photo` is null
      user.Photo = user.Photo 
          ? `${baseURL}${user.Photo.startsWith('/uploads') ? user.Photo : `/uploads/${user.Photo}`}`
          : `${baseURL}/uploads/default_pro.png`;

      res.status(200).json(user);
  });
};

// Function to handle photo update request
const updateUserPhoto = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  
  // Check if a photo was uploaded
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;
  if (!photoPath) {
    return res.status(400).json({ message: "No photo file uploaded" });
  }

  // Call updateUserPhoto in the database
  const sql = "CALL UpdateUserPhoto(?, ?)";
  db.query(sql, [userId, photoPath], (err, result) => {
    if (err) {
      console.error("Database error during photo update:", err);
      return res.status(500).json({ message: "Something unexpected has occurred" });
    }

    console.log("Photo updated successfully");
    return res.status(200).json({ message: "Photo updated successfully" });
  });
};


// Function to get details for non-doctor users
const getAllNonDoctorUsers = async (req, res) => {
  // SQL query to select non-doctor users who are active
  const sql = "SELECT * FROM get_all_non_doctor_users";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Something unexpected has occurred" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No non-doctor users found" });
    }

    // Add base URL for photo if it exists
    const baseURL = process.env.BASE_URL || "http://localhost";
    
    // Loop through the result and modify photo URL for each user
    result.forEach(user => {
      // Set `Photo` URL with baseURL, use default if `Photo` is null
      user.Photo = user.Photo 
        ? `${baseURL}${user.Photo.startsWith('/uploads') ? user.Photo : `/uploads/${user.Photo}`}`
        : `${baseURL}/uploads/default_pro.png`;
    });

    // Return the list of users with their photo URLs
    res.status(200).json(result);
  });
};

module.exports = {
  createUserAccount,
  deleteUserAccount,
  updateUserAccount,
  getNonDoctorUserDetails,
  getDoctorUserDetails,
  updateUserPhoto,
  getAllNonDoctorUsers
};
