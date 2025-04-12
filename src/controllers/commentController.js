const commentService = require('../services/commentService');

module.exports = {
    async addComment(req, res) {
        try {
            const { postId, comment } = req.body;
            const userId = req.user.id; // Authenticated user's ID

            const response = await commentService.addComment(postId, comment, userId);
            res.status(201).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async getCommentsByPost(req, res) {
        try {
            const { postId } = req.params;
            const comments = await commentService.getCommentsByPost(postId);
            res.status(200).json(comments);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async editComment(req, res) {
        try {
            const { commentId } = req.params;
            const { comment } = req.body;
            const userId = req.user.id;

            const response = await commentService.editComment(commentId, comment, userId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;

            const response = await commentService.deleteComment(commentId, userId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async superuserEditComment(req, res) {
        try {
            const { commentId } = req.params;
            const { comment } = req.body;

            const response = await commentService.superuserEditComment(commentId, comment);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async superuserDeleteComment(req, res) {
        try {
            const { commentId } = req.params;

            const response = await commentService.superuserDeleteComment(commentId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};