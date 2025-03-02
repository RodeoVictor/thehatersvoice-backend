const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentSchema = new mongoose.Schema({
    commentId: { type: Number, unique: true }, 
    postId: { type: Number, required: true }, 
    userId: { type: Number, required: true },
    comment: { type: String, required: [true, 'Comment is required'] }, 
    createdAt: { type: Date, default: Date.now }, 
});

//auto-increment comment ID
commentSchema.plugin(AutoIncrement, { inc_field: 'commentId', start_seq: 1 });

module.exports = mongoose.model('Comment', commentSchema);