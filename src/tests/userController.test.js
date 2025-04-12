
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

afterAll(async () => {
  await User.deleteMany({ username: /testuser/ });
  await mongoose.connection.close();
});

describe('User Controller', () => {
  let token;
  let userId;
  const unique = Date.now(); //ensures that test user is not a duplicate
  const testUser = {
    name: 'Test User',
    username: `testuser${unique}`,
    email: `test${unique}@example.com`,
    password: '1234',
    dob: '1999-01-01',
    phone: '1234567890',
    isAdmin: false
  };

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toHaveProperty('username', testUser.username);

    userId = res.body.user.id;
  });

  it('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a single user by ID', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  it('should update the user information', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ phone: '5555555555' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('phone', '5555555555');
  });

  it('should delete the user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
});