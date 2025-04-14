const Comment = require('../infrastructure/mongodb/models/comment');
const Post = require('../infrastructure/mongodb/models/post');

module.exports = {
    async addComment(postId, comment, userId) {
        console.log('addComment called with:', { postId, comment, userId });

        const existingPost = await Post.findOne({ postid: postId });
        if (!existingPost) {
            console.error('Post not found for postId:', postId);
            throw { status: 404, message: 'Post not found' };
        }

        const newComment = new Comment({ postId, userId, comment });
        await newComment.save();

        console.log('Comment added successfully:', newComment);
        return { message: 'Comment added successfully', comment: newComment };
    },

    async getCommentsByPost(postId) {
        console.log('getCommentsByPost called with:', { postId });
    
        const comments = await Comment.find({ postId });

        if (!comments.length) {
            console.warn('No comments found for postId:', postId);
            return []; //no data
        }
    
        console.log('Comments retrieved:', comments);
        return comments;
    },

    async editComment(commentId, comment, userId) {
        console.log('editComment called with:', { commentId, comment, userId });

        const existingComment = await Comment.findOne({ commentId });
        if (!existingComment) {
            console.error('Comment not found for commentId:', commentId);
            throw { status: 404, message: 'Comment not found' };
        }

        if (existingComment.userId !== userId) {
            const User = require('../infrastructure/mongodb/models/user');
            const requestingUser = await User.findOne({ id: userId });
        
            if (!requestingUser || !requestingUser.isAdmin) {
                console.warn('Edit denied: user is not comment owner or admin', { commentId, userId });
                throw { status: 403, message: 'Unauthorized to edit this comment' };
            }
        
            console.log('Admin override: editing comment not owned by user');
        }

        existingComment.comment = comment;
        await existingComment.save();

        console.log('Comment updated successfully:', existingComment);
        return { message: 'Comment updated successfully', comment: existingComment };
    },

    async deleteComment(commentId, userId) {
        console.log('deleteComment called with:', { commentId, userId });

        const existingComment = await Comment.findOne({ commentId });
        if (!existingComment) {
            console.error('Comment not found for commentId:', commentId);
            throw { status: 404, message: 'Comment not found' };
        }

        if (existingComment.userId !== userId) {
            console.error('Unauthorized to delete comment:', { commentId, userId });
            throw { status: 403, message: 'Unauthorized to delete this comment' };
        }

        await existingComment.deleteOne();

        console.log('Comment deleted successfully:', commentId);
        return { message: 'Comment deleted successfully' };
    },

    async superuserEditComment(commentId, comment, userId) {
        console.log('superuserEditComment called with:', { commentId, comment, userId });
    
        const existingComment = await Comment.findOne({ commentId });
        if (!existingComment) {
            console.error('Comment not found for commentId:', commentId);
            throw { status: 404, message: 'Comment not found' };
        }
    
        if (!userId) {
            throw { status: 400, message: 'User ID is missing' }; // User ID check
        }
    
        existingComment.comment = comment;
        await existingComment.save();
    
        console.log('Comment updated by superuser:', existingComment);
        return { message: 'Comment updated successfully by superuser', comment: existingComment };
    },

    async superuserDeleteComment(commentId) {
        console.log('superuserDeleteComment called with:', { commentId });

        const existingComment = await Comment.findOne({ commentId });
        if (!existingComment) {
            console.error('Comment not found for commentId:', commentId);
            throw { status: 404, message: 'Comment not found' };
        }

        await existingComment.deleteOne();

        console.log('Comment deleted by superuser:', commentId);
        return { message: 'Comment deleted successfully by superuser' };
    },
};