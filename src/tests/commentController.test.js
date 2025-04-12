const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let token;
let userId;
let postId;
let commentId;

const unique = Date.now(); // for unique user/email
const testUser = {
  name: 'Comment Tester',
  username: `commenttester_${unique}`,
  email: `commenttester_${unique}@example.com`,
  password: '1234',
  dob: '1999-01-01',
  phone: '1234567890'
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thehatersvoice_test');

  //create unique user
  const user = new User({
    ...testUser,
    password: await bcrypt.hash(testUser.password, 10)//hashed password to bypass registration
  });
  await user.save();
  userId = user.id;

  //generate token
  token = jwt.sign({ id: userId, username: user.username }, process.env.JWT_SECRET || 'testsecret');

  
  const post = new Post({
    userId,
    post: 'Test post content',
  });
  await post.save();
  postId = post.postid;
});

afterAll(async () => {
  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({ username: new RegExp(`^commenttester_`) });//clean up unique users
  await mongoose.connection.close();
});

describe('Comment Controller', () => {
  it('should add a comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        comment: 'This is a test comment'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toHaveProperty('comment', 'This is a test comment');
    commentId = res.body.comment.commentId;
  });

  it('should fetch comments for a post', async () => {
    const res = await request(app)
      .get(`/api/comments/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should edit a comment', async () => {
    const res = await request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ comment: 'Updated comment' });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toHaveProperty('comment', 'Updated comment');
  });

  it('should delete a comment', async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
  });
});