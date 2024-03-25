// test/user/listUsers.test.js

const request = require('supertest');
const app = require('../../server'); // Adjust the path to where your app is defined
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('GET /user', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should list all users', async () => {
    // Create users individually for this test case
    await request(app).post('/user/create').send({ username: 'testuser1', password: 'password123' });
    await request(app).post('/user/create').send({ username: 'testuser2', password: 'password123' });

    const response = await request(app).get('/user/list');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(2); 
  });
});

