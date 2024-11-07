const db = require('../db');

// Get all department details
const getDepartmentDetails = async (req, res) => {
  try {
    const sql = "SELECT * FROM DepartmentDetails";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log('Department details retrieved successfully');
      return res.status(200).json(result);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Database query failed");
  }
};


const getDoctorsByDepartmentID = async (req, res) => {
  try {
    const departmentID = req.params.id;
    const sql = "CALL GetDoctorsByDepartmentID(?)";

    db.query(sql, [departmentID], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      // Access the first element of the result array to get the department data
      const departments = result[0]; // Assuming result[0] contains the department data

      const baseUrl = process.env.BASE_URL;

      // Map through the departments and update the DoctorPhoto for each doctor
      const parsedResult = departments.map(department => {
        // Parse the Doctors JSON string into an array
        const doctors = JSON.parse(department.Doctors);

        // Prepend base URL to each DoctorPhoto
        const updatedDoctors = doctors.map(doctor => ({
          ...doctor,
          DoctorPhoto: doctor.DoctorPhoto ? `${baseUrl}${doctor.DoctorPhoto}` : null, // Handle null case
        }));

        return {
          ...department,
          Doctors: updatedDoctors // Replace the original Doctors array with updated one
        };
      });

      console.log('Data retrieved, parsed, and photo URLs updated successfully');
      return res.status(200).json(parsedResult);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Database query failed");
  }
};

const insertDepartment = async (req, res) => {
  try {
    const { departmentName, hod } = req.body;

    // Check if the department already exists (case insensitive)
    const checkDeptSql = "SELECT COUNT(*) AS count FROM Departments WHERE LOWER(DepartmentName) = LOWER(?)";
    const checkHodSql = "SELECT COUNT(*) AS count FROM Doctors WHERE DoctorID = ?";

    db.query(checkDeptSql, [departmentName], (err, result) => {
      if (err) {
        console.error("Error checking department existence:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      if (result[0].count > 0) {
        return res.status(400).json({ message: "Error: Department name already exists" });
      }

      // Check if the provided HOD ID exists
      db.query(checkHodSql, [hod], (err, result) => {
        if (err) {
          console.error("Error checking HOD existence:", err);
          return res.status(500).json({ message: "Something unexpected has occurred" });
        }

        if (result[0].count === 0) {
          return res.status(400).json({ message: "Error: Invalid HOD ID: Doctor not found" });
        }

        // Now we can call the procedure to insert the new department
        const insertSql = "CALL InsertDepartment(?, ?)";
        db.query(insertSql, [departmentName, hod], (err) => {
          if (err) {
            console.error("Database error while inserting department:", err);
            return res.status(500).json({ message: "Something unexpected has occurred" });
          }

          return res.status(200).json({ message: "Department inserted successfully" });
        });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Something unexpected has occurred" });
  }
};



// Update department
const updateDepartment = async (req, res) => {
  try {
    const { departmentID, newDepartmentName, newHOD } = req.body;
    const sql = "CALL updateDepartment(?, ?, ?)";

    db.query(sql, [departmentID, newDepartmentName, newHOD], (err, result) => {
      if (err) {
        // Log the error details
        console.error("Database error:", err);

        // Check for specific SQL error types
        if (err.code === 'ER_SIGNAL_EXCEPTION') {
          // Extract the custom error message from sqlMessage
          const errorMessage = err.sqlMessage;
          return res.status(400).json({ message: errorMessage });
        }

        // Handle generic SQL error messages
        if (err.sqlMessage) {
          return res.status(400).json({ message: `Database error: ${err.sqlMessage}` });
        }

        // Fallback for any other unexpected errors
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }

      console.log("Department updated successfully");
      return res.status(200).json({ message: "Department updated successfully" });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Something unexpected has occurred" });
  }
};



// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const deptID = req.params.id;

    // Step 1: Check if the department exists
    const checkSql = "SELECT * FROM Departments WHERE departmentID = ?"; // Use the correct column name here
    db.query(checkSql, [deptID], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error while checking department:", checkErr);
        return res.status(500).json({ message: "Error while checking department: " + checkErr.sqlMessage });
      }

      // Step 2: If the department does not exist
      if (checkResult.length === 0) {
        return res.status(404).json({ message: "No department found to delete" });
      }

      // Step 3: Proceed to delete the department
      const sql = "CALL DeleteDepartment(?)";
      db.query(sql, [deptID], (err, result) => {
        if (err) {
          console.error("Database error while deleting department:", err);
          return res.status(500).json({ message: "Error while deleting department: " + err.sqlMessage });
        }

        console.log("Department deleted successfully");
        return res.status(200).json({ message: "Department deleted successfully" });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Something unexpected has occurred: " + err.message });
  }
};


module.exports = {
  getDepartmentDetails,
  getDoctorsByDepartmentID,
  insertDepartment,
  updateDepartment,
  deleteDepartment
};
