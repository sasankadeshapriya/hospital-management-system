const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


// Route imports
const patientsRoute = require('./routes/patientsRoute');
const inventoryRoute = require('./routes/inventoryRoute');
const labTestRoute = require('./routes/labTestsRoute');
const departmentRoute = require('./routes/departmentRoute');
const userAccountRoute = require('./routes/userAccountRoute')

// Use Routes
app.use('/api/v1/patients', patientsRoute);
app.use('/api/v1/inventory', inventoryRoute);
app.use('/api/v1/labtests', labTestRoute);
app.use('/api/v1/departments', departmentRoute);
app.use('/api/v1/user', userAccountRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
