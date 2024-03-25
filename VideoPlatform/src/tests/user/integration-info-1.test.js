//create 10 users
//user 9 update sociallinks
//checkpoint
//user 2 updates username to be user 10(err)
//checkpoint
//user 2 updatebio
//checkpoint
//user 10 deletes account
//checkpoint
//user 10 try to update bio(err)
//checkpoint

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

  afterEach(async () => {
    // Clean up users after each test
    await mongoose.connection.db.dropDatabase();
    users = [];
  });

  it("performs user profile operations", async () => {
    // User 9 updates social links
    await request(app)
      .put(`/user/updateSocialLinks`)
      .set("Authorization", `Bearer ${users[8].token}`)
      .send({
        socialMediaLinks: [
          { name: "Twitter", url: "https://twitter.com/user9" },
        ],
      });

    // Checkpoint
    const user9Response = await request(app).get(
      `/user/get/${users[8].useruuid}`
    );
    expect(user9Response.status).toBe(200);
    // console.log(user9Response.body.socialMediaLinks);
    expect(user9Response.body.socialMediaLinks).toEqual([
      { name: "Twitter", url: "https://twitter.com/user9" },
    ]);

    // User 2 updates username to be user 10 (error expected)
    const user2UpdateResponse = await request(app)
      .put(`/user/updateUsername`)
      .set("Authorization", `Bearer ${users[1].token}`)
      .send({ username: "user10" });

    // Checkpoint
    expect(user2UpdateResponse.status).toBe(409); // Assuming a 400 status code for an error

    // User 2 updates bio
    await request(app)
      .put(`/user/updateBio`)
      .set("Authorization", `Bearer ${users[1].token}`)
      .send({ bio: "Updated bio for user 2" });

    // Checkpoint
    const user2BioResponse = await request(app).get(
      `/user/get/${users[1].useruuid}`
    );
    expect(user2BioResponse.status).toBe(200);
    expect(user2BioResponse.body.bio).toBe("Updated bio for user 2");

    // User 10 deletes account
    await request(app)
      .post(`/user/delete`)
      .set("Authorization", `Bearer ${users[9].token}`)
      .send({ password: "password123" });

    // Checkpoint
    const deletedUser10Response = await request(app).get(
      `/user/${users[9].useruuid}`
    );
    expect(deletedUser10Response.status).toBe(404);

    // User 10 tries to update bio (error expected)
    const user10UpdateBioResponse = await request(app)
      .put(`/user/updateBio`)
      .set("Authorization", `Bearer ${users[9].token}`)
      .send({ bio: "Updating bio after account deletion" });

    // Checkpoint
    expect(user10UpdateBioResponse.status).toBe(404); // Assuming a 401 status code for an unauthorized error

    // let usersAfterTest = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    // // Print the users to the console
    // console.log(JSON.stringify(usersAfterTest, null, 2));
  });
});
