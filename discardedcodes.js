//SERVER.JS
// const express = require('express');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // Load environment variables
// dotenv.config();

// // Import MongoDB connection
// const connectDB = require('./config/db');
// connectDB(); // Connect to MongoDB database

// // Initialize Express App
// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(bodyParser.json());

// // Define User Schema
// const userSchema = new mongoose.Schema({
//     id: { type: Number, unique: true, required: true },
//     name: { type: String, required: true },
//     username: { type: String, unique: true, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     dob: { type: Date, required: true },
//     phone: { type: String, required: true },
// });

// // Create User Model
// const User = mongoose.model('User', userSchema);

// // Routes
// // Root Endpoint
// app.get('/', (req, res) => {
//     res.send('TheHatersVoice backend');
// });

// // Create a New User
// app.post('/api/users', async (req, res) => {
//     const { id, name, username, email, password, dob, phone } = req.body;

//     try {
//         // Check if the username already exists
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Username already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create and save the new user
//         const newUser = new User({ id, name, username, email, password: hashedPassword, dob, phone });
//         await newUser.save();

//         res.status(201).json({ message: 'User created successfully', user: newUser });
        
//         console.log('User created successfully');
//     } catch (err) {
//         console.error('Error creating user:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Fetch All Users
// app.get('/api/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     } catch (err) {
//         console.error('Error fetching users:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Start the Server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



//INDEX.JS
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// require('dotenv').config();

// // Connect to MongoDB
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected...');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// };

// // Define User Schema
// const userSchema = new mongoose.Schema({
//     id: { type: Number, unique: true, required: true },
//     name: { type: String, required: true },
//     username: { type: String, unique: true, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     dob: { type: Date, required: true },
//     phone: { type: String, required: true },
// });

// // Create User Model
// const User = mongoose.model('User', userSchema);

// // Add User Data Function
// const addUser = async (userData) => {
//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ username: userData.username });
//         if (existingUser) {
//             console.log(`User with username ${userData.username} already exists.`);
//             return;
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(userData.password, 10);

//         // Create and save user
//         const user = new User({
//             ...userData,
//             password: hashedPassword, // Replace plaintext password with hashed password
//         });
//         await user.save();
//         console.log(`User ${userData.username} added successfully.`);
//     } catch (err) {
//         console.error('Error adding user:', err.message);
//     }
// };

// // Main Function
// const main = async () => {
//     await connectDB();

//     // Example User Data
//     const users = [
//         {
//             id: 1,
//             name: 'John Doe',
//             username: 'johndoe',
//             email: 'john@example.com',
//             password: 'password123',
//             dob: '1990-01-01',
//             phone: '123-456-7890',
//         },
//         {
//             id: 2,
//             name: 'Jane Smith',
//             username: 'janesmith',
//             email: 'jane@example.com',
//             password: 'securepassword',
//             dob: '1995-05-15',
//             phone: '987-654-3210',
//         },
//     ];

//     // Add Each User
//     for (const user of users) {
//         await addUser(user);
//     }

//     mongoose.connection.close();
// };

// // Execute the Main Function
// main();


// const authenticate = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Add the user info to the request
//         const user = await User.findOne({ id: req.user.id });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         req.user.isAdmin = user.isAdmin;
//         next();
//     } catch (err) {
//         res.status(400).json({ error: 'Invalid token.' });
//     }
// };
