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
const inventoryRoute = require('./routes/inventoryRoute')
const labTestRoute = require('./routes/labTestsRoute')
const departmentRoute = require('./routes/departmentRoute')
const doctorAvailabilityRoute = require('./routes/doctorAvailabilityRoute');
const doctorAppointmentsRoute = require('./routes/doctorAppointmentsRoute');

// Use Routes
app.use('/api/v1/patients', patientsRoute);
app.use('/api/v1/inventory', inventoryRoute);
app.use('/api/v1/labtests', labTestRoute);
app.use('/api/v1/departments', departmentRoute);
app.use('/api/v1/doc-availability', doctorAvailabilityRoute);
app.use('/api/v1/doc-appointments', doctorAppointmentsRoute);

module.exports = app;
