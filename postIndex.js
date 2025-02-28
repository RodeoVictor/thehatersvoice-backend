const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import the User model
const Post = require('./models/Post'); // Import the Post model

const router = express.Router();

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the user info to the request
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Add a post
router.post('/posts', authenticate, async (req, res) => {
    const { post } = req.body; // Changed from `content` to `post`
    try {
        const newPost = new Post({
            userId: req.user.id, // Use the authenticated user's ID
            post, // Post content
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (err) {
        console.error('Error creating post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts
        res.status(200).json(posts); // Return the posts as JSON
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit a post
router.put('/posts/:postid', authenticate, async (req, res) => {
    const { postid } = req.params;
    const { post } = req.body;

    try {
        const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (existingPost.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this post.' });
        }

        // Update the post content
        existingPost.post = post;
        await existingPost.save();

        res.status(200).json({ message: 'Post updated successfully', post: existingPost });
    } catch (err) {
        console.error('Error updating post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete('/posts/:postid', authenticate, async (req, res) => {
    const { postid } = req.params;

    try {
        const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (existingPost.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this post.' });
        }

        await existingPost.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like a post
router.post('/posts/:postid/like', authenticate, async (req, res) => {
    const { postid } = req.params;

    try {
        const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        existingPost.likeCount += 1; // Increment the like count
        await existingPost.save();

        res.status(200).json({ message: 'Post liked successfully', post: existingPost });
    } catch (err) {
        console.error('Error liking post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; // Export the router