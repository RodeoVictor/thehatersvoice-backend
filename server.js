const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

connectDB(); // Connect to MongoDB database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('TheHatersVoice backend');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
