// tests/user/updatePassword.test.js

const request = require("supertest");
const app = require("../../server"); // Adjust the path to your server file as needed
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const config = require("../../config"); // Make sure this path is correct

describe("POST /user/updatePassword", () => {
  let mongoServer;
  let resetToken;
  let userUUID;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a user via the built-in route
    const createUserResponse = await request(app).post('/user/create').send({
      username: 'testUser',
      password: 'testPass',
    });
    userUUID = createUserResponse.body.useruuid; // Adjust based on the actual response property name

    // Generate a reset token
    resetToken = jwt.sign({ id: userUUID }, config.jwtResetSecret, { expiresIn: '1h' });
  });

  it("should successfully update the user's password", async () => {
    const newPassword = "newTestPass";
    const response = await request(app)
      .post("/user/updatePassword")
      .send({ resetToken, newPassword });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Password successfully updated.");
  });

  it("should not update the password with an invalid reset token", async () => {
    const response = await request(app)
      .post("/user/updatePassword")
      .send({ resetToken: "invalidToken", newPassword: "newTestPass" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired reset token.");
  });

  it("should not update the password without a reset token", async () => {
    const response = await request(app)
      .post("/user/updatePassword")
      .send({ newPassword: "newTestPass" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Reset token and new password are required.");
  });

  it("should allow login with new password after successful update", async () => {
    const newPassword = "newTestPass";
    await request(app)
      .post("/user/updatePassword")
      .send({ resetToken, newPassword });

    // Attempt to log in with the new password
    const loginResponse = await request(app).post('/user/login').send({
      username: 'testUser',
      password: newPassword,
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("message", "Login successful");
    expect(loginResponse.body).toHaveProperty("token");
  });
  it("should not allow login with old password after successful update", async () => {
    const oldPassword = "testPass"; // The original password
    const newPassword = "newTestPass"; // The new password
    
    // First, update the user's password
    await request(app)
      .post("/user/updatePassword")
      .send({ resetToken, newPassword });
  
    // Then, attempt to log in with the old password
    const loginResponse = await request(app).post('/user/login').send({
      username: 'testUser',
      password: oldPassword,
    });
  
    // Expect the login attempt with the old password to fail
    expect(loginResponse.statusCode).toBe(401);
    expect(loginResponse.body).toHaveProperty("message", "Authentication failed: incorrect password.");
  });
  
});
