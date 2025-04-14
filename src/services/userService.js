const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../infrastructure/mongodb/models/user');

module.exports = {
    async registerUser(userData) {
        console.log('registerUser called with:', userData);

        const { password, ...rest } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ ...rest, password: hashedPassword });
        await newUser.save();

        console.log('User registered successfully:', newUser);
        return { message: 'User registered successfully', user: newUser };
    },

    async loginUser(username, email, password) {
        console.log('loginUser called with:', { username, email });

        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            console.error('Invalid username/email or password:', { username, email });
            throw { status: 404, message: 'Invalid username/email or password' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password for user:', { username, email });
            throw { status: 401, message: 'Invalid username/email or password' };
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        console.log('Login successful for user:', { username, email });
        return {
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email },
            token,
        };
    },

    async getAllUsers() {
        console.log('getAllUsers called');
    
        const users = await User.find();
        console.log('Users retrieved:', users.map(user => user.username)); // Logs an array of usernames
        return users;
    },

    async getUserById(id) {
        console.log('getUserById called with:', { id });

        const user = await User.findOne({ id });
        if (!user) {
            console.error('User not found for id:', id);
            throw { status: 404, message: 'User not found' };
        }

        console.log('User retrieved:', user);
        return user;
    },

    async updateUser(id, updatedData) {
        console.log('updateUser called with:', { id, updatedData });

        const user = await User.findOne({ id });
        if (!user) {
            console.error('User not found for id:', id);
            throw { status: 404, message: 'User not found' };
        }

        Object.assign(user, updatedData);
        await user.save();

        console.log('User updated successfully:', user);
        return { message: 'User updated successfully', user };
    },

    async deleteUser(id) {
        console.log('deleteUser called with:', { id });

        const user = await User.findOneAndDelete({ id });
        if (!user) {
            console.error('User not found for id:', id);
            throw { status: 404, message: 'User not found' };
        }

        console.log('User deleted successfully:', user);
        return { message: 'User deleted successfully', user };
    },

    async getCurrentUser(userId) {
        console.log('getCurrentUser called with:', { userId });

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found for id:', userId);
            throw { status: 404, message: 'User not found' };
        }

        console.log('Current user retrieved:', user);
        return user;
    },
};