
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

afterAll(async () => {
  await User.deleteMany({ username: /testuser/ });
  await Post.deleteMany({});
  await mongoose.connection.close();
});

describe('Post Controller', () => {
  let token;
  let postId;
  let userId;
  const unique = Date.now(); //ensures that test user is not a duplicate
  const testUser = {
    name: 'Post Test User',
    username: `testuser${unique}`,
    email: `test${unique}@example.com`,
    password: '1234',
    dob: '1999-01-01',
    phone: '1234567890',
    isAdmin: true
  };

  beforeAll(async () => {
    const registerRes = await request(app).post('/api/users/register').send(testUser);
    userId = registerRes.body.user.id;

    const loginRes = await request(app).post('/api/users/login').send({
      username: testUser.username,
      password: testUser.password
    });
    token = loginRes.body.token;
  });

  it('should add a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ post: 'This is a test post' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Post created successfully');
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
      .send({ post: 'This is an edited post' });

    expect(res.statusCode).toBe(200);
    expect(res.body.post.post).toBe('This is an edited post');
  });

  it('should like the post', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Post liked successfully');
    expect(res.body.post.likeCount).toBeGreaterThan(0);
  });

  it('should edit the post as superuser', async () => {
    const res = await request(app)
      .put(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ post: 'Edited by admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body.post.post).toBe('Edited by admin');
  });

  it('should delete the post as superuser', async () => {
    const res = await request(app)
      .delete(`/api/admin/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Post deleted successfully by superuser');
  });
});