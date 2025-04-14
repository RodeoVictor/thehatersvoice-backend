const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const { authenticate, authenticateAdmin } = require('../../middleware/authMiddleware');

// Add a comment to a post
router.post('/', authenticate, commentController.addComment);

// Get all comments for a post
// commentRoutes.js
router.get('/:postId', commentController.getCommentsByPost);

// Edit a comment
router.put('/:commentId', authenticate, commentController.editComment);

// Delete a comment
router.delete('/:commentId', authenticate, commentController.deleteComment);

// Superuser edit a comment
router.put('/admin/:commentId', authenticateAdmin, commentController.superuserEditComment);

// Superuser delete a comment
router.delete('/admin/:commentId', authenticateAdmin, commentController.superuserDeleteComment);

module.exports = router;