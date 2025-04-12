const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../infrastructure/mongodb/models/user');

module.exports = {
    async registerUser(userData) {
        const { password, ...rest } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ ...rest, password: hashedPassword });
        await newUser.save();

        return { message: 'User registered successfully', user: newUser };
    },

    async loginUser(username, email, password) {
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            throw { status: 404, message: 'Invalid username/email or password' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw { status: 401, message: 'Invalid username/email or password' };
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        return {
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email },
            token,
        };
    },

    async getAllUsers() {
        return await User.find();
    },

    async getUserById(id) {
        const user = await User.findOne({ id });
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        return user;
    },

    async updateUser(id, updatedData) {
        const user = await User.findOne({ id });
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        Object.assign(user, updatedData);
        await user.save();

        return { message: 'User updated successfully', user };
    },

    async deleteUser(id) {
        const user = await User.findOneAndDelete({ id });
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        return { message: 'User deleted successfully', user };
    },

    async getCurrentUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        return user;
    },
};