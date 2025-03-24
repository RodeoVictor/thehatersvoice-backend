const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

const postSchema = new mongoose.Schema({
    postid: { type: Number, unique: true }, // Auto-incremented primary key
    userId: { type: Number, required: true }, // The user who posted it (referencing user ID)
    title: { type: String, required: [true, 'Title is required'] }, // Post title
    post: { type: String, required: [true, 'Post is required'] }, // Post content
    postedAt: { type: Date, default: Date.now }, // Date and time of post creation
    likeCount: { type: Number, default: 0 }, // Number of likes (default to 0)
    likedBy: { type: [Number], default: [] }, //keeps track of what user liked a post
});

// Add the auto-increment plugin
postSchema.plugin(AutoIncrement, { inc_field: 'postid', start_seq: 1 }); // Starts post IDs at 1

module.exports = mongoose.model('Post', postSchema);