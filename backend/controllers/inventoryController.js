const db = require('../db');

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
    getInventoryItems,
    getExpiredInventoryItems,
    getInventoryItemByID,
    updateInventoryItem,
    deleteItem
}