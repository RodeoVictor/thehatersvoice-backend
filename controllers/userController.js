const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/authMiddleware');
const express = require('express');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    const { id, name, username, email, password, dob, phone, isAdmin } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

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

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} must be unique` });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid username/email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username/email or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: user.isAdmin }, // Include isAdmin here
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch single user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, username, email, password, dob, phone } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (dob) user.dob = dob;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} must be unique` });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOneAndDelete({ id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
      console.log('Decoded user from token:', req.user);
      const user = await User.findById(req.user.id);
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json({ message: 'You are logged in!', user });
    } catch (err) {
      console.error('Error in getCurrentUser:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
};