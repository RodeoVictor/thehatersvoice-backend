require('dotenv').config({ path: './src/.env.test' });

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../infrastructure/mongodb/models/user');
const Post = require('../infrastructure/mongodb/models/post');

let token;
let postId;

const unique = Date.now();
const testUser = {
  name: 'Post Test User',
  username: `testuser_${unique}`,
  email: `testuser_${unique}@example.com`,
  password: '1234',
  dob: '1999-01-01',
  phone: '1234567890',
  isAdmin: true
};

afterAll(async () => {
  await User.deleteMany({ username: new RegExp('^testuser_') });
  await Post.deleteMany({});
  await mongoose.connection.close();
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thehatersvoice_test');

  const registerRes = await request(app).post('/api/users/register').send(testUser);
  userId = registerRes.body.user.id;

  const loginRes = await request(app).post('/api/users/login').send({
    username: testUser.username,
    password: testUser.password
  });
  token = loginRes.body.token;
});

describe('Post Controller', () => {
  it('should add a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Title', post: 'This is a test post' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Post created successfully');
    expect(res.body.post).toHaveProperty('title', 'Test Title');
    postId = res.body.post.postid;
  });

  it('should fetch all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should edit the post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', post: 'This is an edited post' });

    expect(res.statusCode).toBe(200);
    expect(res.body.post.post).toBe('This is an edited post');
    expect(res.body.post.title).toBe('Updated Title');
  });

  it('should like the post', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Post liked successfully');
    expect(res.body.post.likeCount).toBeGreaterThan(0);
  });
});