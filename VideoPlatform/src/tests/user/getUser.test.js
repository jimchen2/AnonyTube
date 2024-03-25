// test/user/getUser.test.js

const request = require("supertest");
const app = require("../../server"); // Adjust the path based on the location of your Express app's entry point
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("GET /user/get/:uuid", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should retrieve the user with the specified UUID", async () => {
    const userPayload = {
      username: "getUserTest",
      password: "password123", // make sure you use the expected payload format used by your /user/create endpoint
    };

    const createUserResponse = await request(app)
      .post("/user/create")
      .send(userPayload);

    expect(createUserResponse.status).toBe(201); // Assuming 201 Created status code upon successful creation

    // Now retrieve the user using the UUID returned from the create endpoint
    const createdUserUUID = createUserResponse.body.user.useruuid; // Adjust based on how your API responds
    const response = await request(app).get(`/user/get/${createdUserUUID}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("useruuid", createdUserUUID);
  });

  it("should return a 404 error for a non-existent UUID", async () => {
    const fakeUUID = "123e4567-e89b-12d3-a456-426614174000"; // Example of a UUID format
    const response = await request(app).get(`/user/get/${fakeUUID}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found"); // This message should match your API's 404 response for a user not found
  });
  it("should retrieve multiple users with their specified UUIDs", async () => {
    // Define an array to hold UUIDs for created users.
    const userUUIDs = [];

    // Use a loop to create multiple users.
    for (let i = 1; i <= 3; i++) {
      const userPayload = {
        username: `getUserTest${i}`,
        password: `password${i}`,
        // Include additional fields required by your User model.
      };

      const createUserResponse = await request(app)
        .post("/user/create")
        .send(userPayload);

      expect(createUserResponse.status).toBe(201); // Assuming 201 Created status upon successful creation.

      // Store created user's UUID for retrieval test.
      userUUIDs.push(createUserResponse.body.user.useruuid); // Make sure this matches the shape of your response.
    }

    // Use a loop to test the retrieval of each created user by UUID.
    for (const uuid of userUUIDs) {
      const userResponse = await request(app).get(`/user/get/${uuid}`);
      expect(userResponse.status).toBe(200);
    //   console.log(userResponse.body)
      expect(userResponse.body.useruuid).toBe(uuid); // Confirm that the retrieved user's UUID matches the expected value.
    }
  });
});
