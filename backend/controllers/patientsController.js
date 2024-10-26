const mssql = require('mssql');

const getPatients = async (req, res) => {
  try {
    const pool = await mssql.connect();
    const result = await pool.request().query('SELECT * FROM Patients');
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('Database query failed');
  }
};

module.exports = {
  getPatients,
};
