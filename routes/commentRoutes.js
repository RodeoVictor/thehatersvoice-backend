const express = require('express');
const {
    addComment,
    getCommentsByPost,
    editComment,
    deleteComment,
    superuserEditComment,
    superuserDeleteComment,
} = require('../controllers/commentController');
<<<<<<< HEAD
const { authenticate } = require('../controllers/postController.js'); // Use the existing authentication middleware
const{ authenticateAdmin} = require('../controllers/postController.js'); // Use the existing admin middleware
=======
const { authenticate } = require('../controllers/postController'); // Use the existing authentication middleware
const{ authenticateAdmin} = require('../controllers/postController'); // Use the existing admin middleware
>>>>>>> 4c8741e04a262b165c57a4ae1be8be4a02e7b2c2
const router = express.Router();

// Comment routes
router.post('/comments', authenticate, addComment); // Add a comment to a post
router.get('/comments/:postId', getCommentsByPost); // Get all comments for a post
router.put('/comments/:commentId', authenticate, editComment); // Edit a comment
router.delete('/comments/:commentId', authenticate, deleteComment); // Delete a comment

// Superuser routes
router.put('/admin/comments/:commentId', authenticateAdmin, superuserEditComment); // Superuser edit
router.delete('/admin/comments/:commentId', authenticateAdmin, superuserDeleteComment); // Superuser delete

module.exports = router;