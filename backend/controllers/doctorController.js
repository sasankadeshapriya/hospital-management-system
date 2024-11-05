const db = require('../db');

const getDoctors = async (req, res) => {
    try {
        const sql = "SELECT * FROM vw_Doctors";

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }

            const baseUrl = "http://localhost:5000/api/v1";

            const parsedResult = result.map(row => ({
                ...row,
                Photo: `${baseUrl}${row.Photo}`,
                Availability: JSON.parse(row.Availability)
            }));

            console.log('Data retrieved, parsed, and photo URLs updated successfully');
            return res.status(200).json(parsedResult);
        });

    } catch (err) {
        console.log(err);
        res.status(500).send('Database query failed');
    }
};



const getDoctorById = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "call getDoctorsById(?)";

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }

            const baseUrl = "http://localhost:5000/api/v1";

            const doctor = result[0][0];
            if (doctor) {
                doctor.Availability = JSON.parse(doctor.Availability);
                doctor.Photo = `${baseUrl}${doctor.Photo}`;
            }

            console.log('Data retrieved, parsed, and photo URL updated successfully');
            return res.status(200).json(doctor || {});
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