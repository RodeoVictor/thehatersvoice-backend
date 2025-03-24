const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

// Authenticate User Middleware
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store decoded user info in req

        const user = await User.findOne({ id: req.user.id });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        req.user.isAdmin = user.isAdmin;
        next();
    } catch (err) {
        res.status(400).json({ error: 'You are not logged in. Invalid token.' });
    }
};

const authenticateAdmin = async (req, res, next) => {
    await authenticate(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ error: 'You cannot perform this action. Please log in!' });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only!' });
        }
        next();
    });
};

const addPost = async (req, res) => {
    const { title, post } = req.body;

    try {
        const newPost = new Post({
            userId: req.user.id,
            title,
            post,
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (err) {
        console.error('Error creating post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editPost = async (req, res) => {
    const { postid } = req.params;
    const { title, post } = req.body;

    try {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (existingPost.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this post.' });
        }

        existingPost.title = title;
        existingPost.post = post;
        await existingPost.save();

        res.status(200).json({ message: 'Post updated successfully', post: existingPost });
    } catch (err) {
        console.error('Error updating post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    const { postid } = req.params;

    try {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (existingPost.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this post.' });
        }

        await existingPost.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const likePost = async (req, res) => {
    const { postid } = req.params;
  
    try {
      const post = await Post.findOne({ postid });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const userId = req.user.id;
  
      const hasLiked = post.likedBy.includes(userId);
  
      if (hasLiked) {
        //if user has already liked - remove like
        post.likedBy = post.likedBy.filter(id => id !== userId);
        post.likeCount = Math.max(0, post.likeCount - 1); //safety check
      } else {
        //user hasn't liked – add like
        post.likedBy.push(userId);
        post.likeCount += 1;
      }
  
      await post.save();
  
      res.status(200).json({
        //logging
        message: hasLiked ? 'Post unliked successfully' : 'Post liked successfully',
        post,
      });
    } catch (err) {
      console.error('Error toggling like:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const superuserEditPost = async (req, res) => {
    const { postid } = req.params;
    const { title, post } = req.body;

    try {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        existingPost.title = title;
        existingPost.post = post;
        await existingPost.save();

        res.status(200).json({ message: 'Post updated successfully by superuser', post: existingPost });
    } catch (err) {
        console.error('Error updating post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const superuserDeletePost = async (req, res) => {
    const { postid } = req.params;

    try {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await existingPost.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully by superuser' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticate,
    authenticateAdmin,
    addPost,
    getAllPosts,
    editPost,
    deletePost,
    likePost,
    superuserEditPost,
    superuserDeletePost,
};
