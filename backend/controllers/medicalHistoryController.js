const db = require('../db');

const insertMedicalHistoryByPatientId = async (req, res) => {
    try {
        const PatientID = req.params.id;
        const {Diagnosis, TreatmentHistory, Allergies, PreviousSurgeries,FamilyHistory } = req.body;
        const sql = "call insertMedicalHistoryById(?,?,?,?,?,?)";

        const values = [
            PatientID,
            Diagnosis,
            TreatmentHistory,
            Allergies,
            PreviousSurgeries,
            FamilyHistory
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

const getMedicalHistoryByPatientID = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "call getMedicalHistoryByPatientID(?);";

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

const updateMedicalHistoryByPatientId = async (req, res) => {
    try {
        const PatientID = req.params.id;
        const {Diagnosis, TreatmentHistory, Allergies, PreviousSurgeries,FamilyHistory } = req.body;
        const sql = "select updateMedicalHistoryById(?,?,?,?,?,?)";

        const values = [
            PatientID,
            Diagnosis,
            TreatmentHistory,
            Allergies,
            PreviousSurgeries,
            FamilyHistory
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

module.exports = {
    getMedicalHistoryByPatientID,
    insertMedicalHistoryByPatientId,
    updateMedicalHistoryByPatientId
}