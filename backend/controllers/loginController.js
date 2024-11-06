const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const loginUser = (req, res) => {
    const { Email, Password } = req.body;

    // Query to check if the user exists in the UserAccounts table
    const sql = "SELECT * FROM UserAccounts WHERE Email = ?";
    db.query(sql, [Email], async (err, users) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Unexpected server error" });
        }
        if (!users.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        let tokenPayload = {
            userId: user.UserID,
            role: user.AccountType,
            name: user.Name,
            email: user.Email,
            address: user.Address,
            dob: user.DOB,
            contactNumber: user.ContactNumber,
            photo: user.Photo,
            isActive: user.isActive,
        };

        // If the user is a Doctor, fetch additional details from DoctorUserDetailsView
        if (user.AccountType === "Doctor") {
            const doctorDetailsSql = "SELECT * FROM DoctorUserDetailsView WHERE UserID = ?";
            db.query(doctorDetailsSql, [user.UserID], (doctorErr, doctorResult) => {
                if (doctorErr) {
                    console.error("Database error:", doctorErr);
                    return res.status(500).json({ message: "Unexpected server error" });
                }

                if (doctorResult.length === 0) {
                    return res.status(404).json({ message: "Doctor details not found" });
                }

                const doctorData = doctorResult[0];

                // Extend tokenPayload with additional doctor-specific fields
                tokenPayload = {
                    ...tokenPayload,
                    specialization: doctorData.Specialization,
                    status: doctorData.Status,
                    doj: doctorData.DOJ,
                    departmentID: doctorData.DepartmentID,
                    availability: doctorData.Availability,
                };

                // Generate JWT token with 1-hour expiration
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Set token in an HTTP-only cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Enable in production
                    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
                });

                res.json({ message: "Login successful" });
            });
        } else {
            // Non-doctor user, proceed with existing tokenPayload
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Enable in production
                maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
            });

            res.json({ message: "Login successful" });
        }
    });
};

// Logout function to clear the token cookie
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
};

module.exports = { loginUser, logoutUser };
