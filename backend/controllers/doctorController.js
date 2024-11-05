const db = require('../db');

const getDoctors = async (req, res) => {
    try {
        const sql = "SELECT * FROM vw_Doctors";

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

const getDoctorById= async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "call getDoctorsById(?)";

        db.query(sql,[id], (err, result) => {
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

module.exports = {
    getDoctors,
    getDoctorById
}