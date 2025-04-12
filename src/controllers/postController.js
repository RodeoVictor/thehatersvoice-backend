const postService = require('../services/postService');

module.exports = {
    async addPost(req, res) {
        try {
            const { title, post } = req.body;
            const userId = req.user.id;

            const response = await postService.addPost(userId, title, post);
            res.status(201).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async getAllPosts(req, res) {
        try {
            const posts = await postService.getAllPosts();
            res.status(200).json(posts);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async editPost(req, res) {
        try {
            const { postid } = req.params;
            const { title, post } = req.body;
            const userId = req.user.id;

            const response = await postService.editPost(postid, title, post, userId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async deletePost(req, res) {
        try {
            const { postid } = req.params;
            const userId = req.user.id;

            const response = await postService.deletePost(postid, userId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async likePost(req, res) {
        try {
            const { postid } = req.params;
            const userId = req.user.id;

            const response = await postService.toggleLike(postid, userId);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async superuserEditPost(req, res) {
        try {
            const { postid } = req.params;
            const { title, post } = req.body;

            const response = await postService.superuserEditPost(postid, title, post);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async superuserDeletePost(req, res) {
        try {
            const { postid } = req.params;

            const response = await postService.superuserDeletePost(postid);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};