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
        const sql = 'call getDoctorAppointmentByQueueId(?)';

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
        // req body -> all the fields in Doctor_Appointments, AvailabilityID of chosen doctor availability slot
        const { AppointmentDate, AppointmentTime, Status, PatientID, DoctorID, AppointmentType, AvailabilityID } = req.body;

        const checkSql = "SELECT * FROM Doctor_Appointments WHERE AppointmentDate = ? and PatientID = ? and DoctorID = ?";

        db.query(checkSql, [AppointmentDate, PatientID, DoctorID], (err, checkResult) => {
            if (err) {
                console.error("Database error during appointment check:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }

            if (checkResult.length > 0) {
                return res.status(409).json({ message: "A patient with this appointment is already registered." });
            } else {
                const sql = "SELECT insertDoctorAppointment(?,?,?,?,?,?,?)";

                const values = [
                    AppointmentDate,
                    AppointmentTime,
                    Status,
                    PatientID,
                    DoctorID,
                    AppointmentType,
                    AvailabilityID
                ];

                db.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ message: "Something unexpected has occurred" });
                    }
                    console.log("Data inserted successfully");
                    return res.status(200).json(result);
                });
            }
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Something unexpected has occurred :" });
    }
}

const updateDoctorAppointmentStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { Status } = req.body;

        const values = [
            id,
            Status
        ];

        const sql = "call updateAppointmentStatusById(?,?)";

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
}

const deleteDoctorAppointment = async (req, res) => {
    try {
        const id = req.params.id;

        const sql = "call deleteAppointmentStatusById(?)";

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            console.log("Soft delete successful");
            return res.status(200).json(result);
        });
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
    insertDoctorAppointment,
    updateDoctorAppointmentStatus,
    getDoctorAppointmentByQueueId,
    deleteDoctorAppointment
}