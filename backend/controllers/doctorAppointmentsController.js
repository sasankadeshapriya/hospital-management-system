const db = require('../db');

const getDoctorAppointments = async (req, res) => {
    try {
        const sql = 'select * from vw_doctor_appointments';

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}

const getDoctorAppointmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call getDoctorAppointmentById(?)';

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}


// id parameter and date query parameter
const getDoctorAppointmentByDocId = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.query.date;

        const sql = date
            ? 'call getDoctorAppointmentByDocIdAndDate(?, ?)'
            : 'call getDoctorAppointmentByDocId(?)';

        const params = date ? [id, date] : [id];

        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}

const getDoctorAppointmentByPatientId = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call getDoctorAppointmentByPatientId(?)';

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}

const getDoctorAppointmentByQueueId = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call getDoctorAppointmentByQueueId(?);';

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}

const insertDoctorAppointment = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Something unexpected has occurred" });
    }
}

module.exports = {
    getDoctorAppointments,
    getDoctorAppointmentById,
    getDoctorAppointmentByDocId,
    getDoctorAppointmentByPatientId,
    getDoctorAppointmentByQueueId
}