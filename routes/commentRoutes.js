const express = require('express');
const {
    addComment,
    getCommentsByPost,
    editComment,
    deleteComment,
    superuserEditComment,
    superuserDeleteComment,
} = require('../controllers/commentController');
const { authenticate } = require('../controllers/postController'); // Use the existing authentication middleware
const{ authenticateAdmin} = require('../controllers/postController'); // Use the existing admin middleware
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