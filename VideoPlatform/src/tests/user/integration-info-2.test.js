//create 10 users
//user 9 update phone
//user 9 update profileimage
//checkpoint
//user 9 update phone
//user 9 update email
//checkpoint
//user 2 delete account
//checkpoint
//user 3 update username to be user 2
//checkpoint
//user 3 update profileimage

// userProfileOperations.test.js

const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("User Profile Operations Test", () => {
  let mongoServer;
  let users = [];

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
    // Create 10 users
    for (let i = 1; i <= 10; i++) {
      const userResponse = await request(app)
        .post("/user/create")
        .send({ username: `user${i}`, password: "password123" });

      users.push({
        useruuid: userResponse.body.user.useruuid,
        token: userResponse.body.token,
      });
    }
  });

  it("performs user profile operations", async () => {
    // User 9 updates phone
    await request(app)
      .put(`/user/updatePhone`)
      .set("Authorization", `Bearer ${users[8].token}`)
      .send({ phone: "1234567890" });

    // User 9 updates profile image
    await request(app)
      .put(`/user/updateProfileImage`)
      .set("Authorization", `Bearer ${users[8].token}`)
      .send({ userimageurl: "new_image.jpg" });

    // Checkpoint
    const user9Response = await request(app).get(
      `/user/get/${users[8].useruuid}`
    );
    expect(user9Response.status).toBe(200);
    expect(user9Response.body.phoneHashed).toBeDefined();
    expect(user9Response.body.userimageurl).toBe("new_image.jpg");

    // User 9 updates email
    await request(app)
      .put(`/user/updateEmail`)
      .set("Authorization", `Bearer ${users[8].token}`)
      .send({ email: "user9@example.com" });

    // Checkpoint
    const user9EmailResponse = await request(app).get(
      `/user/get/${users[8].useruuid}`
    );
    expect(user9EmailResponse.status).toBe(200);
    expect(user9EmailResponse.body.emailHashed).toBeDefined();

    // User 2 deletes account
    await request(app)
      .post(`/user/delete`)
      .set("Authorization", `Bearer ${users[1].token}`)
      .send({ password: "password123" });

    // Checkpoint
    const deletedUser2Response = await request(app).get(
      `/user/${users[1].useruuid}`
    );
    expect(deletedUser2Response.status).toBe(404);

    // User 3 updates username to be user 2
    await request(app)
      .put(`/user/updateUsername`)
      .set("Authorization", `Bearer ${users[2].token}`)
      .send({ username: "user2" });

    // Checkpoint
    const user3Response = await request(app).get(
      `/user/get/${users[2].useruuid}`
    );
    expect(user3Response.status).toBe(200);
    expect(user3Response.body.username).toBe("user2");

    // let dsafasdf = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    // // Print the users to the console
    // console.log(JSON.stringify(dsafasdf, null, 2));
  });
});
