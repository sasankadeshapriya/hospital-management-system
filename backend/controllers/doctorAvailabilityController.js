const db = require('../db');

const getAvailabilitySlots = async (req, res) => {
    try {
        const sql = 'select * from vw_availabilitySlots';

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

const getAvailabilitySlotsById = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call getAvailabilitySlotsByID(?)';

        db.query(sql,[id],(err, result) => {
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

const getAvailabilitySlotsByDocId = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call getAvailabilitySlotsByDocID(?)';

        db.query(sql,[id],(err, result) => {
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

const getAvailabilitySlotsByDay = async (req, res) => {
    try {
        const day = req.params.day;

        const validDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        if (!validDays.includes(day.toLowerCase())) {
            return res.status(400).json({ message: "Invalid day provided. Please enter a valid day of the week." });
        }

        const sql = 'call getAvailabilitySlotsByDay(?)';

        db.query(sql,[day],(err, result) => {
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

const getAvailabilitySlotsByRoomNo = async (req, res) => {
    try {
        const id = req.params.roomNo;
        const sql = 'call getAvailabilitySlotsByRoomNo(?)';

        db.query(sql,[id],(err, result) => {
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

const insertAvailabilitySlot = async (req, res) => {
    try {
        const { DoctorID, RoomNO, AvailableDay, StartTime, EndTime} = req.body;

        if (StartTime > EndTime) {
           console.error("Time period invalid");
           return res.status(409).json({ message: "Time period invalid" });
        }

        const checkSql = "call checkAvailability(?,?,?,?)";
        db.query(checkSql, [RoomNO, AvailableDay, StartTime, EndTime], (err, checkResult) => {
            if (err) {
                console.error("Database error during availability check:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            const availableSlots = checkResult[0];


            if (availableSlots.length > 0) {
                return res.status(409).json({ message: "An availability slot with this room with this date and time already exists." });
            }

            const values = [
                DoctorID,
                RoomNO,
                AvailableDay,
                StartTime,
                EndTime
            ];

            const sql = "call insertSlot(?, ?, ?, ?, ?);";

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Something unexpected has occurred" });
                }
                console.log("Data inserted successfully");
                return res.status(200).json(result);
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Something unexpected has occurred" });
    }
}

const updateAvailabilitySlot = async (req, res) => {
    try {
        const id = req.params.id;
        const { DoctorID, RoomNO, AvailableDay, StartTime, EndTime} = req.body;

        if (StartTime > EndTime) {
           console.error("Time period invalid");
           return res.status(409).json({ message: "Time period invalid" });
        }

        const checkSql = "call checkAvailability(?,?,?,?)";
        db.query(checkSql, [RoomNO, AvailableDay, StartTime, EndTime], (err, checkResult) => {
            if (err) {
                console.error("Database error during availability check:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            const availableSlots = checkResult[0];


            if (availableSlots.length > 0) {
                return res.status(409).json({ message: "An availability slot with this room with this date and time already exists." });
            }

            const values = [
                id,
                DoctorID,
                RoomNO,
                AvailableDay,
                StartTime,
                EndTime
            ];

            const sql = "call updateSlot(?,?, ?, ?, ?, ?);";

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Something unexpected has occurred" });
                }
                console.log("Data inserted successfully");
                return res.status(200).json(result);
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Something unexpected has occurred" });
    }
}

module.exports = {
    getAvailabilitySlots,
    getAvailabilitySlotsById,
    getAvailabilitySlotsByDocId,
    getAvailabilitySlotsByDay,
    getAvailabilitySlotsByRoomNo,
    insertAvailabilitySlot,
    updateAvailabilitySlot
}