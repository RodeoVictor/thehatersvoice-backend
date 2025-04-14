const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/config'); // Database connection
dotenv.config({ path: './.env' }); // Explicitly point to root-level .env

// Import routes
const userRoutes = require('./ports/routes/userRoutes');
const postRoutes = require('./ports/routes/postRoutes');
const commentRoutes = require('./ports/routes/commentRoutes');

// Load environment variables
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express(); // Initialize the Express app

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Built-in middleware for parsing JSON

// API routes
app.use('/api/users', userRoutes); // Routes for users
app.use('/api/posts', postRoutes); // Routes for posts
app.use('/api/comments', commentRoutes); // Routes for comments

// Root endpoint
app.get('/', (req, res) => {
    res.send('TheHatersVoice backend');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});