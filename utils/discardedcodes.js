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


// for post(controllerand routes)
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User'); // Import the User model
// const Post = require('./models/Post'); // Import the Post model
// const Comment = require('./models/Comment');

// const router = express.Router();

// //authenticate user middleware
// //note: added previous method to discarded code. This one is just slightly altered to accomodate superusers/admins
// const authenticate = async (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; //store decoded user info in req

//         //find user
//         const user = await User.findOne({ id: req.user.id });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found!' });
//         }

//         req.user.isAdmin = user.isAdmin; //attach admin status to user
//         next();
//     } catch (err) {
//         res.status(400).json({ error: 'Invalid token.' });
//     }
// };

// //authenticate admin
// const authenticateAdmin = async (req, res, next) => {
//     await authenticate(req, res, () => {
//         if (!req.user) {
//             return res.status(401).json({ error: 'You cannot perform this action. Please log in!' });
//         }
        
//         if (!req.user.isAdmin) {
//             return res.status(403).json({ error: 'Access denied. Admins only!' });
//         }
//         next();
//     });
// };



// // Add a post
// router.post('/posts', authenticate, async (req, res) => {
//     const { post } = req.body; // Changed from `content` to `post`
//     try {
//         const newPost = new Post({
//             userId: req.user.id, // Use the authenticated user's ID
//             post, // Post content
//         });
//         await newPost.save();
//         res.status(201).json({ message: 'Post created successfully', post: newPost });
//     } catch (err) {
//         console.error('Error creating post:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Get all posts
// router.get('/posts', async (req, res) => {
//     try {
//         const posts = await Post.find(); // Fetch all posts
//         res.status(200).json(posts); // Return the posts as JSON
//     } catch (err) {
//         console.error('Error fetching posts:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Edit a post
// router.put('/posts/:postid', authenticate, async (req, res) => {
//     const { postid } = req.params;
//     const { post } = req.body;

//     try {
//         const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

//         if (!existingPost) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         // Check if the authenticated user is the owner of the post
//         if (existingPost.userId !== req.user.id) {
//             return res.status(403).json({ error: 'You are not authorized to edit this post.' });
//         }

//         // Update the post content
//         existingPost.post = post;
//         await existingPost.save();

//         res.status(200).json({ message: 'Post updated successfully', post: existingPost });
//     } catch (err) {
//         console.error('Error updating post:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Delete a post
// router.delete('/posts/:postid', authenticate, async (req, res) => {
//     const { postid } = req.params;

//     try {
//         const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

//         if (!existingPost) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         // Check if the authenticated user is the owner of the post
//         if (existingPost.userId !== req.user.id) {
//             return res.status(403).json({ error: 'You are not authorized to delete this post.' });
//         }

//         await existingPost.deleteOne();

//         res.status(200).json({ message: 'Post deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting post:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Like a post
// router.post('/posts/:postid/like', authenticate, async (req, res) => {
//     const { postid } = req.params;

//     try {
//         const existingPost = await Post.findOne({ postid }); // Use `postid` instead of `id`

//         if (!existingPost) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         existingPost.likeCount += 1; // Increment the like count
//         await existingPost.save();

//         res.status(200).json({ message: 'Post liked successfully', post: existingPost });
//     } catch (err) {
//         console.error('Error liking post:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// //comments

// //add comment
// router.post('/posts/:postid/comments', authenticate, async (req, res) => {
//     const { postid } = req.params;
//     const { comment } = req.body;

//     try {
//         //find post
//         const existingPost = await Post.findOne({ postid });
//         if (!existingPost) {
//             return res.status(404).json({ error: 'Post not found!' });
//         }

//         //create comment
//         const newComment = new Comment({
//             postId: postid,
//             userId: req.user.id,
//             comment,
//         });

//         await newComment.save();
//         res.status(201).json({ message: 'Comment added.', comment: newComment });
//     } catch (err) {
//         console.error('Error adding comment:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// //get comments for post
// router.get('/posts/:postid/comments', async (req, res) => {
//     const { postid } = req.params;

//     try {
//         const comments = await Comment.find({ postId: postid });
//         res.status(200).json(comments);
//     } catch (err) {
//         console.error('Error fetching comments:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// //delete a comment
// //users own comment
// router.delete('/posts/:postid/comments/:commentid', authenticate, async (req, res) => {
//     const { commentid } = req.params;

//     try {
//         const comment = await Comment.findOne({ commentId: commentid });
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found!' });
//         }

//         //ensure user made the comment
//         if (comment.userId !== req.user.id) {
//             return res.status(403).json({ error: 'That is not your comment!.' });
//         }

//         await comment.deleteOne();
//         res.status(200).json({ message: 'Comment deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting comment:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// //superuser/any comment
// //note: couldn't get this to work in postman yet
// router.delete('/admin/comments/:commentid', authenticateAdmin, async (req, res) => {
//     const { commentid } = req.params;

//     try {
//         const comment = await Comment.findOne({ commentId: commentid });
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found!' });
//         }

//         await comment.deleteOne();
//         res.status(200).json({ message: 'Comment deleted by Admin.' });
//     } catch (err) {
//         console.error('Error deleting comment:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// //edit any comment as Admin
// router.put('/admin/comments/:commentid', authenticateAdmin, async (req, res) => {
//     const { commentid } = req.params;
//     const { comment } = req.body;

//     try {
//         let existingComment = await Comment.findOne({ commentId: commentid });

//         if (!existingComment) {
//             return res.status(404).json({ error: 'Comment not found!' });
//         }

//         existingComment.comment = comment;
//         await existingComment.save();

//         res.status(200).json({ message: 'Comment updated by admin.', comment: existingComment });
//     } catch (err) {
//         console.error('Error updating comment:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// //Edit comment as user
// router.put('/posts/:postid/comments/:commentid', authenticate, async (req, res) => {
//     const { commentid } = req.params;
//     const { comment } = req.body;

//     try {
//         let existingComment = await Comment.findOne({ commentId: commentid });
//         if (!existingComment) {
//             return res.status(404).json({ error: 'Comment not found!' });
//         }

//         //ensure user made comment
//         if (existingComment.userId !== req.user.id) {
//             return res.status(403).json({ error: 'You do not own this comment! Edit denied.' });
//         }

//         //modify comment
//         existingComment.comment = comment;
//         await existingComment.save();

//         res.status(200).json({ message: 'Comment updated!', comment: existingComment });
//     } catch (err) {
//         console.error('Error updating comment:', err.message);
//         res.status(500).json({ error: 'Server Error Encountered!' });
//     }
// });

// module.exports = router;

// 
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const User = require('../models/User'); // Import the User model
// const Post = require('../models/Post'); // Import the Post model

// const router = express.Router();

// // app.use(cors({
// //     origin: 'http://localhost:5173',
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true,
// // })); // Enable CORS

// // Register a new user
// router.post('/users/register', async (req, res) => {
//     const { id, name, username, email, password, dob, phone, isAdmin } = req.body;

//     try {
//         // Hash the password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user instance
//         const newUser = new User({
//             id,
//             name,
//             username,
//             email,
//             password: hashedPassword,
//             dob,
//             phone,
//             isAdmin: isAdmin === true, 
//         });

//         // Save to the database
//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully', user: newUser });
//     } catch (err) {
//         // Handle validation errors
//         if (err.name === 'ValidationError') {
//             const errors = Object.values(err.errors).map((error) => error.message);
//             return res.status(400).json({ error: errors.join(', ') });
//         }

//         // Handle duplicate key errors (e.g., unique fields)
//         if (err.code === 11000) {
//             const duplicateField = Object.keys(err.keyValue)[0];
//             return res.status(400).json({ error: `${duplicateField} must be unique` });
//         }

//         // Handle other errors
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Fetch one user 
// router.get('/users/:id', async (req, res) => {
//     const { id } = req.params; // Extract `id` from the route parameter

//     try {
//         // Find user by `id` field
//         const user = await User.findOne({ id });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json(user); // Return the user
//     } catch (err) {
//         console.error('Error fetching user:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Fetch all users
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
        
//     } catch (err) {
//         console.error('Error fetching users:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Edit user
// router.put('/users/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, username, email, password, dob, phone } = req.body;

//     try {
//         // Find user by `id` and update their details
//         const user = await User.findOne({ id });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         if (name) user.name = name;
//         if (username) user.username = username;
//         if (email) user.email = email;
//         if (password) user.password = await bcrypt.hash(password, 10); // Hash new password
//         if (dob) user.dob = dob;
//         if (phone) user.phone = phone;

//         await user.save(); // Save the updated user

//         res.status(200).json({ message: 'User updated successfully', user });
//     } catch (err) {
//         // Handle duplicate key errors (e.g., unique fields)
//         if (err.code === 11000) {
//             const duplicateField = Object.keys(err.keyValue)[0];
//             return res.status(400).json({ error: `${duplicateField} must be unique` });
//         }

//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Delete user
// router.delete('/users/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Find and delete user by `id`
//         const user = await User.findOneAndDelete({ id });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json({ message: 'User deleted successfully', user });
//     } catch (err) {
//         console.error('Error deleting user:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Login route
// router.post('/users/login', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         // Find the user by username or email
//         const user = await User.findOne({
//             $or: [{ username: username }, { email: email }],
//         });

//         if (!user) {
//             return res.status(404).json({ error: 'Invalid username/email or password' });
//         }

//         // Compare the provided password with the hashed password in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid username/email or password' });
//         }

//         // Generate a JWT token
//         const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//             expiresIn: '1h', // Token valid for 1 hour
//         });

//         console.log('Generated Token:', token); // Optional: Log token for debugging

//         // Send the token as part of the response
//         res.status(200).json({
//             message: 'Login successful',
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email,
//             },
//             token, // Return token
//         });
//     } catch (err) {
//         console.error('Error during login:', err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

