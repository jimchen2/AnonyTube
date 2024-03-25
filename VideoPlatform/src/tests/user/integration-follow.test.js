//create 10 users
//checkpoint
//user 1 follow user 2-6
//checkpoint
//user 5 follow user 3-7
//checkpoint
//user 2 unfollow user 1(should err)
//checkpoint
//get user 5 following
//checkpoint
//get users who follow user 4
//checkpoint
//user 7 block user 1
//checkpoint
//user 6 deletes account
//checkpoint

const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("User Follow Operations Test", () => {
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

  it("performs user follow operations", async () => {
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const userResponse = await request(app)
        .post("/user/create")
        .send({ username: `user${i}`, password: "password123" });

      users.push({
        useruuid: userResponse.body.user.useruuid,
        token: userResponse.body.token,
      });
    }
    // User 1 follows users 2-6
    for (let i = 2; i <= 6; i++) {
      await request(app)
        .post(`/user/follow/${users[i - 1].useruuid}`)
        .set("Authorization", `Bearer ${users[0].token}`);
    }
    // let dsafasdf = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    // // Print the users to the console
    // console.log(JSON.stringify(dsafasdf, null, 2));

    // Checkpoint: Verify User 1's followings
    const user1FollowingResponse = await request(app).get(
      `/user/getUserFollowing/${users[0].useruuid}`
    );
    expect(user1FollowingResponse.status).toBe(200);
    expect(user1FollowingResponse.body.following.length).toBe(5);

    // User 5 follows users 3-7
    for (let i = 3; i <= 7; i++) {
      await request(app)
        .post(`/user/follow/${users[i - 1].useruuid}`)
        .set("Authorization", `Bearer ${users[4].token}`);
    }

    // Checkpoint: Verify User 5's followings
    const user5FollowingResponse = await request(app).get(
      `/user/getUserFollowing/${users[4].useruuid}`
    );
    expect(user5FollowingResponse.status).toBe(200);
    expect(user5FollowingResponse.body.following.length).toBe(5);

    // User 2 tries to unfollow User 1 (should err)
    const unfollowResponse = await request(app)
      .post(`/user/unfollow/${users[0].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);
    expect(unfollowResponse.status).toBe(400);

    // Checkpoint: Get User 5's followings
    const user5FollowingsResponse = await request(app).get(
      `/user/getUserFollowing/${users[4].useruuid}`
    );
    expect(user5FollowingsResponse.status).toBe(200);
    expect(user5FollowingsResponse.body.following.length).toBe(5);

    // Checkpoint: Get users who follow User 4
    const user4FollowersResponse = await request(app).get(
      `/user/getUserFollowers/${users[3].useruuid}`
    );
    expect(user4FollowersResponse.status).toBe(200);
    expect(user4FollowersResponse.body.followers.length).toBe(2); // Assuming User 1 and User 5 follow User 4

    // User 7 blocks User 1
    await request(app)
      .post(`/user/block/${users[0].useruuid}`)
      .set("Authorization", `Bearer ${users[6].token}`);

    //   let dsafasdf = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    //   // Print the users to the console
    //   console.log(JSON.stringify(dsafasdf, null, 2));

    // Checkpoint: Verify User 7 has blocked User 1
    const user7BlockedResponse = await request(app).get(
      `/user/getUserBlocked/${users[6].useruuid}`
    );
    expect(user7BlockedResponse.status).toBe(200);
    expect(user7BlockedResponse.body.blocked).toContain(users[0].useruuid);

    // User 6 deletes their account
    await request(app)
      .post(`/user/delete`)
      .set("Authorization", `Bearer ${users[5].token}`)
      .send({ password: "password123" });
  });
  
});
