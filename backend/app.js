const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mssql = require('mssql');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MSSQL Configuration
const sqlConfig = {
    user: process.env.DB_USER,           
    password: process.env.DB_PASSWORD,   
    database: process.env.DB_DATABASE,  
    server: process.env.DB_SERVER,     
    port: parseInt(process.env.DB_PORT), 
    options: {
        encrypt: false,                 
        trustServerCertificate: true,    
    },
};

// Global MSSQL Connection
mssql.connect(sqlConfig).then(pool => {
  if (pool.connected) {
    console.log('Connected to MSSQL Database');
  }
}).catch(err => console.log('Database Connection Error: ', err));

// Route imports
const testRoute = require('./routes/testRoute');
const patientsRoute = require('./routes/patientsRoute');

// Use Routes
app.use('/api/v1/test', testRoute);
app.use('/api/v1/test', patientsRoute);

module.exports = app;
