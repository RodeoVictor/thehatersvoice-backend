const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/User'); // Import the User model
const Post = require('../models/Post'); // Import the Post model

const router = express.Router();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// })); // Enable CORS

// Register a new user
router.post('/users/register', async (req, res) => {
    const { id, name, username, email, password, dob, phone, isAdmin } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            id,
            name,
            username,
            email,
            password: hashedPassword,
            dob,
            phone,
            isAdmin: isAdmin === true, 
        });

        // Save to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ error: errors.join(', ') });
        }

        // Handle duplicate key errors (e.g., unique fields)
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} must be unique` });
        }

        // Handle other errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch one user 
router.get('/users/:id', async (req, res) => {
    const { id } = req.params; // Extract `id` from the route parameter

    try {
        // Find user by `id` field
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user); // Return the user
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit user
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, username, email, password, dob, phone } = req.body;

    try {
        // Find user by `id` and update their details
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash new password
        if (dob) user.dob = dob;
        if (phone) user.phone = phone;

        await user.save(); // Save the updated user

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        // Handle duplicate key errors (e.g., unique fields)
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} must be unique` });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete user by `id`
        const user = await User.findOneAndDelete({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/users/login', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Find the user by username or email
        const user = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid username/email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username/email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token valid for 1 hour
        });

        console.log('Generated Token:', token); // Optional: Log token for debugging

        // Send the token as part of the response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token, // Return token
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router; // Export the router