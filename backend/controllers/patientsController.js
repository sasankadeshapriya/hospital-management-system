const db = require('../db');


const getPatients = async (req, res) => {
  try {
    const sql = "SELECT * FROM PatientsView";

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log('Data retrieved successfully');
      return res.status(200).json(result);
    });

  } catch (err) {
    console.log(err);
    res.status(500).send('Database query failed');
  }
};


const getPatientsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "CALL getPatientByID(?)";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log('Data retrieved successfully');
      return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Database query failed');
  }
}

//update
const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const { FirstName, LastName, DOB, Gender, ContactNumber, Address, CNIC, isActive } = req.body;

    const values = [
      id,
      FirstName,
      LastName,
      DOB,
      Gender,
      ContactNumber,
      Address,
      CNIC,
      isActive
    ];

    const sql = "CALL updatePatient(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log("Data updated successfully");
      return res.status(200).json(result);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Something unexpected has occurred" });
  }
};

const addPatient = async (req, res) => {
  try {
    const { FirstName, LastName, DOB, Gender, ContactNumber, Address, CNIC, isActive } = req.body;
    const sql = "CALL addPatient(?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
      FirstName,
      LastName,
      DOB,
      Gender,
      ContactNumber,
      Address,
      CNIC,
      isActive
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log("Data inserted successfully");
      return res.status(200).json(result);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Something unexpected has occurred :" });
  }
}

const deletePatient = (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'call DeletePatientAndAppointments(?)';

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something unexpected has occurred" });
      }
      console.log('Soft delete successful');
      return res.status(200).json(result);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Something unexpected has occurred :" });
  }
}


module.exports = {
  getPatients,
  getPatientsByID,
  updatePatient,
  addPatient,
  deletePatient
};