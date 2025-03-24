const express = require('express');
const {
    authenticate,
    authenticateAdmin,
    addPost,
    getAllPosts,
    editPost,
    deletePost,
    likePost,
    superuserEditPost,
    superuserDeletePost,
} = require('../controllers/postController.js');

const router = express.Router();

// Post routes
router.post('/posts', authenticate, addPost);
router.get('/posts', getAllPosts);
router.put('/posts/:postid', authenticate, editPost);
router.delete('/posts/:postid', authenticate, deletePost);
router.post('/posts/:postid/like', authenticate, likePost);

// Superuser routes
router.put('/admin/posts/:postid', authenticateAdmin, superuserEditPost); // Superuser edit
router.delete('/admin/posts/:postid', authenticateAdmin, superuserDeletePost); // Superuser delete

module.exports = router;