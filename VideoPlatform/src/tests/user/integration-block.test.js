//create 10 users
//user 1 block everyone else
//check
//user 2 try to follow user 1
//check
//user 1 try to follow user 3
//user 6 follow user 3,7
//check
//delete user 1
//check
//user 2 blocks user 3,4
//check
//user 4,5 blocks user2
//check
//get user2 blocked users
//check
//user 2 follow user 7,8,9
//checkpoint
//get people who blocked user2
//checkpoint
//get user who follows user 6
//checkpoint
//user 7 block user 6
//get user who follows user 6
//checkpoint
//user 2 unfollow user 7
//checkpoint

const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("User Block and Follow Operations Test", () => {
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

  it("performs user block and follow operations", async () => {
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

    // User 1 blocks everyone else
    for (let i = 2; i <= 10; i++) {
      await request(app)
        .post(`/user/block/${users[i - 1].useruuid}`)
        .set("Authorization", `Bearer ${users[0].token}`);
    }

    // Check User 1's blocked users
    const user1BlockedResponse = await request(app).get(
      `/user/getUserBlocked/${users[0].useruuid}`
    );
    expect(user1BlockedResponse.status).toBe(200);
    expect(user1BlockedResponse.body.blocked.length).toBe(9);

    // User 2 tries to follow User 1 (should err)
    const user2FollowUser1Response = await request(app)
      .post(`/user/follow/${users[0].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);
    expect(user2FollowUser1Response.status).toBe(403);

    // User 1 tries to follow User 3 (should err)
    const user1FollowUser3Response = await request(app)
      .post(`/user/follow/${users[2].useruuid}`)
      .set("Authorization", `Bearer ${users[0].token}`);
    expect(user1FollowUser3Response.status).toBe(403);

    // User 6 follows User 3 and User 7
    await request(app)
      .post(`/user/follow/${users[2].useruuid}`)
      .set("Authorization", `Bearer ${users[5].token}`);
    await request(app)
      .post(`/user/follow/${users[6].useruuid}`)
      .set("Authorization", `Bearer ${users[5].token}`);

    // Check User 6's following
    const user6FollowingResponse = await request(app).get(
      `/user/getUserFollowing/${users[5].useruuid}`
    );
    expect(user6FollowingResponse.status).toBe(200);
    expect(user6FollowingResponse.body.following.length).toBe(2);

    // Delete User 1
    await request(app)
      .post(`/user/delete`)
      .set("Authorization", `Bearer ${users[0].token}`)
      .send({ password: "password123" });

    // Check if User 1 is deleted
    const deletedUser1Response = await request(app).get(
      `/user/${users[0].useruuid}`
    );
    expect(deletedUser1Response.status).toBe(404);

    // User 2 blocks User 3 and User 4
    await request(app)
      .post(`/user/block/${users[2].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);
    await request(app)
      .post(`/user/block/${users[3].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);

    // Check User 2's blocked users
    const user2BlockedResponse = await request(app).get(
      `/user/getUserBlocked/${users[1].useruuid}`
    );
    expect(user2BlockedResponse.status).toBe(200);
    expect(user2BlockedResponse.body.blocked.length).toBe(2);

    // User 4 and User 5 block User 2
    await request(app)
      .post(`/user/block/${users[1].useruuid}`)
      .set("Authorization", `Bearer ${users[3].token}`);
    await request(app)
      .post(`/user/block/${users[1].useruuid}`)
      .set("Authorization", `Bearer ${users[4].token}`);

    // Get users who blocked User 2
    const usersWhoBlockedUser2Response = await request(app).get(
      `/user/getUserBeingBlocked/${users[1].useruuid}`
    );
    expect(usersWhoBlockedUser2Response.status).toBe(200);
    expect(usersWhoBlockedUser2Response.body.beingBlocked.length).toBe(2);

    // User 2 follows User 7, User 8, and User 9
    await request(app)
      .post(`/user/follow/${users[6].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);
    await request(app)
      .post(`/user/follow/${users[7].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);
    await request(app)
      .post(`/user/follow/${users[8].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);

    // Checkpoint: Get User 2's following
    const user2FollowingResponse = await request(app).get(
      `/user/getUserFollowing/${users[1].useruuid}`
    );
    expect(user2FollowingResponse.status).toBe(200);
    expect(user2FollowingResponse.body.following.length).toBe(3);

    // Checkpoint: Get users who follow User 6
    const user6FollowersResponse = await request(app).get(
      `/user/getUserFollowers/${users[5].useruuid}`
    );
    expect(user6FollowersResponse.status).toBe(200);
    expect(user6FollowersResponse.body.followers.length).toBe(0);

    // User 7 blocks User 6
    await request(app)
      .post(`/user/block/${users[5].useruuid}`)
      .set("Authorization", `Bearer ${users[6].token}`);

    // Checkpoint: Get users who follow User 6 (should be empty)
    const user6FollowersAfterBlockResponse = await request(app).get(
      `/user/getUserFollowers/${users[5].useruuid}`
    );
    expect(user6FollowersAfterBlockResponse.status).toBe(200);
    expect(user6FollowersAfterBlockResponse.body.followers.length).toBe(0);

    // User 2 unfollows User 7
    await request(app)
      .post(`/user/unfollow/${users[6].useruuid}`)
      .set("Authorization", `Bearer ${users[1].token}`);

    // let dsafasdf = await mongoose.model("User").find({}); // Adjust 'User' to your actual model name if different

    // // Print the users to the console
    // console.log(JSON.stringify(dsafasdf, null, 2));

    // Checkpoint: Get User 2's following after unfollowing User 7
    const user2FollowingAfterUnfollowResponse = await request(app).get(
      `/user/getUserFollowing/${users[1].useruuid}`
    );
    expect(user2FollowingAfterUnfollowResponse.status).toBe(200);
    expect(user2FollowingAfterUnfollowResponse.body.following.length).toBe(2);
  });
});
