const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
} = require('../controllers/userController');

const router = express.Router();

// User routes
router.post('/users/register', registerUser); // Register a new user
router.post('/users/login', loginUser); // Login user
router.get('/users', getAllUsers); // Fetch all users
router.get('/users/:id', getUserById); // Fetch single user by ID
router.put('/users/:id', updateUser); // Update user details
router.delete('/users/:id', deleteUser); // Delete user
router.get('/users/me', authenticate, getCurrentUser); //get current logged in user

module.exports = router;// Export the router
