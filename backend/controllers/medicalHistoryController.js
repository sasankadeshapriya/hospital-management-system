const db = require('../db');

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

module.exports = {
    getMedicalHistoryByPatientID,
}