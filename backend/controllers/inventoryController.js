const db = require('../db');

const addInventoryItem = async (req, res) => {
    try {
        const { MedicineName, Quantity, ExpiryDate, Cost } = req.body;

        const checkSql = "SELECT * FROM Inventory WHERE MedicineName = ?";
        db.query(checkSql, [MedicineName, ExpiryDate], (err, checkResult) => {
            if (err) {
                console.error("Database error during inventory check:", err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }

            // If an item with the same MedicineName and ExpiryDate exists, return a conflict error
            if (checkResult.length > 0) {
                return res.status(409).json({ message: "An inventory item with this MedicineName already exists." });
            }

            const values = [
                MedicineName,
                Quantity,
                ExpiryDate,
                Cost,
            ];

            const sql = "call insertInventoryItem(?, ?, ?, ?);";

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
};

const getInventoryItems = async (req, res) => {
    try {
        const sql = 'select * from vw_inventory;';

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


const getExpiredInventoryItems = async (req, res) => {
    try {
        const sql = 'select * from vw_inventory_expired';

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Something unexpected has occurred" });
            }
            if (result.length === 0) {
                return res.status(200).json({ message: "No expired inventory items found", data: [] });
            }
            console.log('Data retrieved successfully');
            return res.status(200).json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Database query failed');
    }
}

const getInventoryItemByID = async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "call getInventoryItemByID(?);";

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

const updateInventoryItem = async (req, res) => {
    try {
        const id = req.params.id;
        const { MedicineName, Quantity, ExpiryDate, Cost } = req.body;

        const values = [
            id,
            MedicineName,
            Quantity,
            ExpiryDate,
            Cost,
        ];

        const sql = "call updateInventoryItem(?, ?, ?, ?, ?);";

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

const deleteItem = (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'call deleteInventoryItemByID(?)';

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
    addInventoryItem,
    getInventoryItems,
    getExpiredInventoryItems,
    getInventoryItemByID,
    updateInventoryItem,
    deleteItem
}