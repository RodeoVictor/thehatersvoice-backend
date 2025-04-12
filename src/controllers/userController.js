const userService = require('../services/userService');

module.exports = {
    async registerUser(req, res) {
        try {
            const userData = req.body;
            const response = await userService.registerUser(userData);
            res.status(201).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async loginUser(req, res) {
        try {
            const { username, email, password } = req.body;
            const response = await userService.loginUser(username, email, password);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.status(200).json(user);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const response = await userService.updateUser(id, updatedData);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const response = await userService.deleteUser(id);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    async getCurrentUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.getCurrentUser(userId);
            res.status(200).json({ message: 'You are logged in!', user });
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};