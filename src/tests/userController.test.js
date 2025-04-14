require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../infrastructure/mongodb/models/user');

const unique = Date.now();
const testUser = {
  name: 'Test User',
  username: `testuser_${unique}`,
  email: `testuser_${unique}@example.com`,
  password: '1234',
  dob: '1999-01-01',
  phone: '1234567890',
  isAdmin: false
};

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thehatersvoice_test');
});

afterAll(async () => {
  await User.deleteMany({ username: /testuser_/ });
  await mongoose.connection.close();
});

describe('User Controller', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toHaveProperty('username', testUser.username);
    userId = res.body.user.id;
  });

  it('should fetch a single user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });
});