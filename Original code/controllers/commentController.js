const Comment = require('../models/Comment');
const Post = require('../models/Post');


// Add a Comment to a Post
const addComment = async (req, res) => {
    const { postId, comment } = req.body;

    try {
        // Check if the post exists
        const existingPost = await Post.findOne({ postid: postId });
        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create a new comment
        const newComment = new Comment({
            postId,
            userId: req.user.id, // Use the authenticated user's ID
            comment,
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        console.error('Error adding comment:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get All Comments for a Post
const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        // Fetch all comments for the post
        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Edit a Comment
const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;

    try {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the authenticated user is the owner of the comment
        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this comment.' });
        }

        // Update the comment content
        existingComment.comment = comment;
        await existingComment.save();

        res.status(200).json({ message: 'Comment updated successfully', comment: existingComment });
    } catch (err) {
        console.error('Error updating comment:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a Comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the authenticated user is the owner of the comment
        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
        }

        await existingComment.deleteOne();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Superuser Edit a Comment
const superuserEditComment = async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;

    try {
        // Find the comment by ID
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Allow superuser to edit any comment
        existingComment.comment = comment;
        await existingComment.save();

        res.status(200).json({ message: 'Comment updated successfully by superuser', comment: existingComment });
    } catch (err) {
        console.error('Error updating comment:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Superuser Delete a Comment
const superuserDeleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        // Find the comment by ID
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Allow superuser to delete any comment
        await existingComment.deleteOne();

        res.status(200).json({ message: 'Comment deleted successfully by superuser' });
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addComment,
    getCommentsByPost,
    editComment,
    deleteComment,
    superuserEditComment,
    superuserDeleteComment,
};