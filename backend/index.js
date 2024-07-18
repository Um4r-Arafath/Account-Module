const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const dataRoutes = require('./dataRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', dataRoutes);

const PORT = process.env.SERVER_PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//