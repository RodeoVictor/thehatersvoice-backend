const Post = require('../infrastructure/mongodb/models/post');

module.exports = {
    async addPost(userId, title, postContent) {
        const newPost = new Post({ userId, title, post: postContent });
        await newPost.save();

        return { message: 'Post created successfully', post: newPost };
    },

    async getAllPosts() {
        const posts = await Post.find();
        return posts;
    },

    async editPost(postid, title, postContent, userId) {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            throw { status: 404, message: 'Post not found' };
        }

        if (existingPost.userId !== userId) {
            throw { status: 403, message: 'Unauthorized to edit this post' };
        }

        existingPost.title = title;
        existingPost.post = postContent;
        await existingPost.save();

        return { message: 'Post updated successfully', post: existingPost };
    },

    async deletePost(postid, userId) {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            throw { status: 404, message: 'Post not found' };
        }

        if (existingPost.userId !== userId) {
            throw { status: 403, message: 'Unauthorized to delete this post' };
        }

        await existingPost.deleteOne();
        return { message: 'Post deleted successfully' };
    },

    async toggleLike(postid, userId) {
        const post = await Post.findOne({ postid });

        if (!post) {
            throw { status: 404, message: 'Post not found' };
        }

        const hasLiked = post.likedBy.includes(userId);

        if (hasLiked) {
            post.likedBy = post.likedBy.filter((id) => id !== userId);
            post.likeCount = Math.max(0, post.likeCount - 1);
        } else {
            post.likedBy.push(userId);
            post.likeCount += 1;
        }

        await post.save();

        return {
            message: hasLiked ? 'Post unliked successfully' : 'Post liked successfully',
            post,
        };
    },

    async superuserEditPost(postid, title, postContent) {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            throw { status: 404, message: 'Post not found' };
        }

        existingPost.title = title;
        existingPost.post = postContent;
        await existingPost.save();

        return { message: 'Post updated successfully by superuser', post: existingPost };
    },

    async superuserDeletePost(postid) {
        const existingPost = await Post.findOne({ postid });

        if (!existingPost) {
            throw { status: 404, message: 'Post not found' };
        }

        await existingPost.deleteOne();
        return { message: 'Post deleted successfully by superuser' };
    },
};