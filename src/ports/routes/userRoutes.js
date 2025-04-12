const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { authenticate, authenticateAdmin } = require('../../middleware/authMiddleware');
// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get a single user by ID
router.get('/:id', authenticate, userController.getUserById);

// Update a user's details
router.put('/:id', authenticate, userController.updateUser);

// Delete a user
router.delete('/:id', authenticate, userController.deleteUser);

// Get the current logged-in user's details
router.get('/current', authenticate, userController.getCurrentUser);

module.exports = router;