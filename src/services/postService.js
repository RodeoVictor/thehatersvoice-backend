const Post = require('../infrastructure/mongodb/models/post');

module.exports = {
    async addPost(userId, title, postContent) {
        console.log('addPost called with:', { userId, title, postContent });

        const newPost = new Post({ userId, title, post: postContent });
        await newPost.save();

        console.log('Post created successfully:', newPost);
        return { message: 'Post created successfully', post: newPost };
    },

    async getAllPosts() {
        console.log('getAllPosts called');

        const posts = await Post.find();
        console.log('Posts retrieved:', posts);
        return posts;
    },

    async editPost(postid, title, postContent, userId) {
        console.log('editPost called with:', { postid, title, postContent, userId });

        const existingPost = await Post.findOne({ postid });
        if (!existingPost) {
            console.error('Post not found for postid:', postid);
            throw { status: 404, message: 'Post not found' };
        }

        if (existingPost.userId !== userId) {
            console.error('Unauthorized to edit post:', { postid, userId });
            throw { status: 403, message: 'Unauthorized to edit this post' };
        }

        existingPost.title = title;
        existingPost.post = postContent;
        await existingPost.save();

        console.log('Post updated successfully:', existingPost);
        return { message: 'Post updated successfully', post: existingPost };
    },

    async deletePost(postid, userId) {
        console.log('deletePost called with:', { postid, userId });

        const existingPost = await Post.findOne({ postid });
        if (!existingPost) {
            console.error('Post not found for postid:', postid);
            throw { status: 404, message: 'Post not found' };
        }

        if (existingPost.userId !== userId) {
            console.error('Unauthorized to delete post:', { postid, userId });
            throw { status: 403, message: 'Unauthorized to delete this post' };
        }

        await existingPost.deleteOne();

        console.log('Post deleted successfully:', postid);
        return { message: 'Post deleted successfully' };
    },

    async toggleLike(postid, userId) {
        console.log('toggleLike called with:', { postid, userId });

        const post = await Post.findOne({ postid });
        if (!post) {
            console.error('Post not found for postid:', postid);
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

        console.log('Like toggled:', { postid, hasLiked, post });
        return {
            message: hasLiked ? 'Post unliked successfully' : 'Post liked successfully',
            post,
        };
    },
};