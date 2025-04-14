const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./ports/routes/userRoutes');
const postRoutes = require('./ports/routes/postRoutes');
const commentRoutes = require('./ports/routes/commentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('TheHatersVoice backend');
});

module.exports = app; // Export app for testing