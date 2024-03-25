// tests/user/loginUser.test.js

const request = require("supertest");
const app = require("../../server"); // Make sure this points to your server file
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("POST /user/login", () => {
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

    beforeEach(async () => {
        // Create test users via your user creation route
        await request(app).post('/user/create').send({ username: 'testuser', password: 'testpass' });
        // Add more setup data as needed
    });

    afterEach(async () => {
        // Cleanup actions if necessary
    });

    it("should successfully log in a user and return a token", async () => {
        const response = await request(app)
            .post("/user/login") // Adjust if your route is different
            .send({
                username: "testuser",
                password: "testpass",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Login successful");
        expect(response.body).toHaveProperty("token");
    });

    it("should fail with incorrect password", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({
                username: "testuser",
                password: "incorrectpassword",
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Authentication failed: incorrect password.");
    });

    it("should fail with non-existent username", async () => {
        // This user is not created in beforeEach, so it should not exist
        const response = await request(app)
            .post("/user/login")
            .send({
                username: "nonexistentuser",
                password: "testpass",
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Authentication failed: username does not exist.");
    });
});
