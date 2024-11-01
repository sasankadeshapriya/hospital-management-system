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

// Use Routes
app.use('/api/v1/patients', patientsRoute);
app.use('/api/v1/inventory', inventoryRoute);

module.exports = app;
