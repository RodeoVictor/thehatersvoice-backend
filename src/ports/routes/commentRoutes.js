const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const { authenticate, authenticateAdmin } = require('../../middleware/authMiddleware');

// Add a comment to a post
router.post('/:postId/comments', authenticate, commentController.addComment);

// Get all comments for a post
router.get('/:postId/comments', commentController.getCommentsByPost);

// Edit a comment
router.put('/comments/:commentId', authenticate, commentController.editComment);

// Delete a comment
router.delete('/comments/:commentId', authenticate, commentController.deleteComment);

// Superuser edit a comment
router.put('/admin/comments/:commentId', authenticateAdmin, commentController.superuserEditComment);

// Superuser delete a comment
router.delete('/admin/comments/:commentId', authenticateAdmin, commentController.superuserDeleteComment);

module.exports = router;