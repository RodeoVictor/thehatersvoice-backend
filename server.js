const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection
const userRoutes = require('./routes/userRoutes'); // Import routes from userRoutes.js
const postRoutes = require('./routes/postRoutes') // Import routes from postRoutes.js


// Load environment variables
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('TheHatersVoice backend');
});

// User routes
app.use('/api', userRoutes); // Use the routes from userRoutes.js


// Post routes
app.use('/api/', postRoutes); // Use the routes from postRoutes.js
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});