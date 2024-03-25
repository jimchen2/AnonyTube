// tests/user/updateUsername.test.js

const request = require("supertest");
const app = require("../../server"); // Adjust this path if needed
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("PUT /user/updateUsername", () => {
  let mongoServer;
  let userToken;
  let userUUID;

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

  beforeEach(async () => {
    // Create a user via the built-in route
    let response = await request(app).post("/user/create").send({
      username: "originalUsername",
      password: "testpass",
    });
    userUUID = response.body.useruuid; // Adjust based on actual response structure

    response = await request(app).post("/user/login").send({
      username: "originalUsername",
      password: "testpass",
    });
    userToken = response.body.token; // Adjust based on actual response structure
  });

  it("should successfully update the username", async () => {
    const newUsername = "newUsername";
    const response = await request(app)
      .put("/user/updateUsername")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: newUsername });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Username updated successfully."
    );
  });

  it("should fail to update to an already existing username", async () => {
    // Create another user with a different username
    await request(app).post("/user/create").send({
      username: "existingUsername",
      password: "testpass",
    });

    // Try to update the first user's username to the existing username
    const response = await request(app)
      .put("/user/updateUsername")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: "existingUsername" });

    expect(response.status).toBe(409);
    // expect(response.body).toHaveProperty(
    //   "message",
    //   "Username is already taken."
    // );
  });

  it("should verify the username is updated correctly in the database", async () => {
    const newUsername = "updatedUsername";
    await request(app)
      .put("/user/updateUsername")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: newUsername });

    const users = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    // Print the users to the console
    // console.log(JSON.stringify(users, null, 2));

    // Re-login to reflect any changes
    const response = await request(app).post("/user/login").send({
      username: newUsername,
      password: "testpass",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });


  it("User A cannot update their username to User B", async () => {
    // Create User A and User B
    // User A is already created in beforeEach
    await request(app).post("/user/create").send({
      username: "userB",
      password: "testpass",
    });

    // Attempt to update User A's username to User B's username
    const response = await request(app)
      .put("/user/updateUsername")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: "userB" });

    expect(response.status).toBe(409); // Username is already taken
  });

  it("should not allow empty username updates", async () => {
    const response = await request(app)
      .put("/user/updateUsername")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "New username is required."
    );
  });
});
