const db = require('../db');

const addLabTest = async (req, res) => {
    try {
        const { TestName, ProcessingTime, Cost } = req.body;

        const checkSql = "SELECT * FROM LabTests WHERE TestName = ?";
        db.query(checkSql, [TestName], (err, checkResult) => {
            if (err) {
                console.error("Database error during TestName check:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }

            if (checkResult.length > 0) {
                return res.status(409).json({ message: "A lab test with this TestName is already registered." });
            }

            const values = [
                TestName,
                ProcessingTime,
                Cost
            ];

            const sql = "call insertLabTest(?, ?, ?)";

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Something unexpected has occurred" });
                }
                console.log("Data updated successfully");
                return res.status(200).json(result);
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Something unexpected has occurred" });
    }
}

const getLabTests = async (req, res) => {
    try {
        const sql = 'select * from vw_labtests;';

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

const getLabTestByID = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "call getLabTestByID(?)";

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

const updateLabTest = async (req, res) => {
    try {
        const id = req.params.id;
        const { TestName, ProcessingTime, Cost } = req.body;

        const values = [
            id,
            TestName,
            ProcessingTime,
            Cost
        ];

        const sql = "call updateLabTest(?, ?, ?, ?)";

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

const deleteLabTest = (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call deleteLabTest(?);';

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
    addLabTest,
    getLabTests,
    getLabTestByID,
    updateLabTest,
    deleteLabTest
}