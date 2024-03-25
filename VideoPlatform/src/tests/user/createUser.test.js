// tests/user/createUser.test.js

const request = require("supertest");
const app = require("../../server"); // Update this path to the location of your server file
const UserModel = require("../../models/Users"); // Update this path to your UserModel location
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

describe("POST /user/create", () => {
  let mongoServer;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      await UserModel.deleteMany({});
      await mongoose.disconnect();
      await mongoServer.stop();
    } catch (error) {
      console.error(error);
    }
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should create a new user and return a token", async () => {
    const userData = {
      username: "testuser",
      password: "testpass",
    };

    const response = await request(app)
      .post("/user/create") // Change this to your correct route if different
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).not.toHaveProperty("passwordhash");

    // Checking that the user indeed exists in the database
    const userInDb = await UserModel.findOne({
      username: userData.username,
    }).lean();
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe(userData.username);

    // Print out the entire user collection in the database for debugging purposes
    // const allUsers = await UserModel.find({}).lean();
    // console.log('All Users in Database:', allUsers);
  });

  it("empty password test", async () => {
    const userData = {
      username: "testuser",
      password: "",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(400);
    // Checking that the user doesn't exists in the database
    const userInDb = await UserModel.findOne({
      username: userData.username,
    }).lean();
    expect(userInDb).toBeNull();
  });

  it("should fail when the username field is missing", async () => {
    const userData = {
      password: "testpass",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(400);

    // Verifying that no user is created in the database
    const usersInDb = await UserModel.find({}).lean();
    expect(usersInDb.length).toBe(0);
  });

  it("should fail when the password field is missing", async () => {
    const userData = {
      username: "testuser",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(400);

    // Verifying that no user is created in the database
    const usersInDb = await UserModel.find({}).lean();
    expect(usersInDb.length).toBe(0);
  });

  it("should not create a user when sent no data", async () => {
    const response = await request(app).post("/user/create").send({});

    expect(response.status).toBe(400);

    // Verifying that no user is created in the database
    const usersInDb = await UserModel.find({}).lean();
    expect(usersInDb.length).toBe(0);
  });

  it("should not create a user when sent extraneous fields only", async () => {
    const userData = {
      randomField1: "randomValue1",
      randomField2: "randomValue2",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(400);

    // Verifying that no user is created in the database
    const usersInDb = await UserModel.find({}).lean();
    expect(usersInDb.length).toBe(0);
  });
  it("should not set userimageurl when provided during user creation", async () => {
    const userData = {
      username: "newuser",
      password: "newpassword",
      userimageurl: "http://example.com/image.png",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user).not.toHaveProperty("userimageurl");

    const userInDb = await UserModel.findOne({
      username: userData.username,
    }).lean();
    expect(userInDb).not.toHaveProperty("userimageurl");
  });

  it("should not set bio when provided during user creation", async () => {
    const userData = {
      username: "newuser",
      password: "newpassword",
      bio: "This is a test bio",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user).not.toHaveProperty("bio");

    const userInDb = await UserModel.findOne({
      username: userData.username,
    }).lean();
    expect(userInDb).not.toHaveProperty("bio");
  });

  it("should not create unrelated fields not defined in the schema", async () => {
    const userData = {
      username: "newuser",
      password: "newpassword",
      othervalue: "This field does not exist in the schema",
    };

    const response = await request(app).post("/user/create").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user).not.toHaveProperty("othervalue");

    const userInDb = await UserModel.findOne({
      username: userData.username,
    }).lean();
    expect(userInDb).not.toHaveProperty("othervalue");
  });
});
