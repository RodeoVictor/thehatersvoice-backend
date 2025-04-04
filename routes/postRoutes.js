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


const express = require('express');
const {
    authenticate,
    authenticateAdmin,
    addPost,
    getAllPosts,
    editPost,
    deletePost,
    likePost,
    superuserEditPost,
    superuserDeletePost,
} = require('../controllers/postController');

const router = express.Router();

// Post routes
router.post('/posts', authenticate, addPost);
router.get('/posts', getAllPosts);
router.put('/posts/:postid', authenticate, editPost);
router.delete('/posts/:postid', authenticate, deletePost);
router.post('/posts/:postid/like', authenticate, likePost);

// Superuser routes
router.put('/admin/posts/:postid', authenticateAdmin, superuserEditPost); // Superuser edit
router.delete('/admin/posts/:postid', authenticateAdmin, superuserDeletePost); // Superuser delete

module.exports = router;