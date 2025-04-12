const Comment = require('../infrastructure/mongodb/models/comment');
const Post = require('../infrastructure/mongodb/models/post');

module.exports = {
    async addComment(postId, comment, userId) {
        const existingPost = await Post.findOne({ postid: postId });

        if (!existingPost) {
            throw { status: 404, message: 'Post not found' };
        }

        const newComment = new Comment({ postId, userId, comment });
        await newComment.save();

        return { message: 'Comment added successfully', comment: newComment };
    },

    async getCommentsByPost(postId) {
        const comments = await Comment.find({ postId });
        if (!comments.length) {
            throw { status: 404, message: 'No comments found for this post' };
        }
        return comments;
    },

    async editComment(commentId, comment, userId) {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            throw { status: 404, message: 'Comment not found' };
        }

        if (existingComment.userId !== userId) {
            throw { status: 403, message: 'Unauthorized to edit this comment' };
        }

        existingComment.comment = comment;
        await existingComment.save();

        return { message: 'Comment updated successfully', comment: existingComment };
    },

    async deleteComment(commentId, userId) {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            throw { status: 404, message: 'Comment not found' };
        }

        if (existingComment.userId !== userId) {
            throw { status: 403, message: 'Unauthorized to delete this comment' };
        }

        await existingComment.deleteOne();

        return { message: 'Comment deleted successfully' };
    },

    async superuserEditComment(commentId, comment) {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            throw { status: 404, message: 'Comment not found' };
        }

        existingComment.comment = comment;
        await existingComment.save();

        return { message: 'Comment updated successfully by superuser', comment: existingComment };
    },

    async superuserDeleteComment(commentId) {
        const existingComment = await Comment.findOne({ commentId });

        if (!existingComment) {
            throw { status: 404, message: 'Comment not found' };
        }

        await existingComment.deleteOne();

        return { message: 'Comment deleted successfully by superuser' };
    },
};