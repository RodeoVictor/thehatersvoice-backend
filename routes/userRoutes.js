const express = require('express');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// User routes
router.post('/users/register', registerUser); // Register a new user
router.post('/users/login', loginUser); // Login user
router.get('/users', getAllUsers); // Fetch all users
router.get('/users/:id', getUserById); // Fetch single user by ID
router.put('/users/:id', updateUser); // Update user details
router.delete('/users/:id', deleteUser); // Delete user

module.exports = router;// Export the router
