const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const { authenticate, authenticateAdmin } = require('../../middleware/authMiddleware');

// Add a new post
router.post('/', authenticate, postController.addPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Edit a post
router.put('/:postid', authenticate, postController.editPost);

// Delete a post
router.delete('/:postid', authenticate, postController.deletePost);

// Like or unlike a post
router.post('/:postid/like', authenticate, postController.likePost);

// Superuser edit a post
router.put('/admin/:postid', authenticateAdmin, postController.superuserEditPost);

// Superuser delete a post
router.delete('/admin/:postid', authenticateAdmin, postController.superuserDeletePost);

module.exports = router;