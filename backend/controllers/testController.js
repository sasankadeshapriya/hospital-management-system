const mssql = require('mssql');

const getDemoData = async (req, res) => {
  try {
    const pool = await mssql.connect();
    const result = await pool.request().query('SELECT TOP 5 * FROM DemoTable');
  } catch (err) {
    console.log(err);
    res.status(500).send('Database query failed');
  }
};

module.exports = {
  getDemoData,
};
