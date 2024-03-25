const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Large Scale User Operations Test", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 300000000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it(
    "performs large scale user operations",
    async () => {
      // Create 1,000 users
      const createUsersStartTime = Date.now();
      const createUserPromises = [];
      for (let i = 1; i <= 1000; i++) {
        createUserPromises.push(
          request(app)
            .post("/user/create")
            .send({ username: `user${i}`, password: `password${i}` })
        );
      }
      await Promise.all(createUserPromises);
      const createUsersEndTime = Date.now();
      console.log(
        `Create 1,000 users: ${createUsersEndTime - createUsersStartTime}ms`
      );

      // Call listUsers 100 times
      const listUsersStartTime = Date.now();
      const listUsersPromises = [];
      for (let i = 0; i < 100; i++) {
        listUsersPromises.push(request(app).get("/user/listUsers"));
      }
      await Promise.all(listUsersPromises);
      const listUsersEndTime = Date.now();
      console.log(
        `List users (100 times): ${listUsersEndTime - listUsersStartTime}ms`
      );

      // Call getUsers for 100 random users
      const getUsersStartTime = Date.now();
      const getUserPromises = [];
      for (let i = 0; i < 100; i++) {
        const userId = (Math.floor(i) % 1000) + 1;
        getUserPromises.push(request(app).get(`/user/user${userId}`));
      }
      await Promise.all(getUserPromises);
      const getUsersEndTime = Date.now();
      console.log(
        `Get users (100 users): ${getUsersEndTime - getUsersStartTime}ms`
      );

      // For every user, randomly follow 1-10 random users
      const followUsersStartTime = Date.now();
      const followPromises = [];
      for (let i = 1; i <= 1000; i++) {
        const numFollows = 5; // Fixed number of follows per user
        for (let j = 0; j < numFollows; j++) {
          const userToFollow = (Math.floor(i + j) % 1000) + 1;
          followPromises.push(
            request(app)
              .post(`/user/follow/user${userToFollow}`)
              .set("Authorization", `Bearer user${i}Token`)
          );
        }
      }
      await Promise.all(followPromises);
      const followUsersEndTime = Date.now();
      console.log(
        `Follow random users: ${followUsersEndTime - followUsersStartTime}ms`
      );

      // For every user, randomly block 2 users
      const blockUsersStartTime = Date.now();
      const blockPromises = [];
      for (let i = 1; i <= 1000; i++) {
        for (let j = 0; j < 2; j++) {
          const userToBlock = (Math.floor(i + j) % 1000) + 1;
          blockPromises.push(
            request(app)
              .post(`/user/block/user${userToBlock}`)
              .set("Authorization", `Bearer user${i}Token`)
          );
        }
      }
      await Promise.all(blockPromises);
      const blockUsersEndTime = Date.now();
      console.log(
        `Block random users: ${blockUsersEndTime - blockUsersStartTime}ms`
      );

      // Try 100 users trying to login together simultaneously
      const loginUsersStartTime = Date.now();
      const loginPromises = [];
      for (let i = 0; i < 100; i++) {
        const userId = (Math.floor(i) % 1000) + 1;
        loginPromises.push(
          request(app)
            .post("/user/login")
            .send({ username: `user${userId}`, password: `password${userId}` })
        );
      }
      await Promise.all(loginPromises);
      const loginUsersEndTime = Date.now();
      console.log(
        `Login users (100 users): ${loginUsersEndTime - loginUsersStartTime}ms`
      );

      // Try to create 100 users with long usernames
      const createLongUsernamesStartTime = Date.now();
      const createLongUsernamePromises = [];
      for (let i = 0; i < 100; i++) {
        const longUsername = "a".repeat(500);
        createLongUsernamePromises.push(
          request(app)
            .post("/user/create")
            .send({ username: longUsername, password: "password" })
        );
      }
      await Promise.all(createLongUsernamePromises);
      const createLongUsernamesEndTime = Date.now();
      console.log(
        `Create users with long usernames (100 users): ${
          createLongUsernamesEndTime - createLongUsernamesStartTime
        }ms`
      );

      // Try to get everyone's following
      const getFollowingStartTime = Date.now();
      const getFollowingPromises = [];
      for (let i = 1; i <= 1000; i++) {
        getFollowingPromises.push(
          request(app).get(`/user/getUserFollowing/user${i}`)
        );
      }
      await Promise.all(getFollowingPromises);
      const getFollowingEndTime = Date.now();
      console.log(
        `Get everyone's following: ${
          getFollowingEndTime - getFollowingStartTime
        }ms`
      );

      // Update username for 100 users
      const updateUsernameStartTime = Date.now();
      const updateUsernamePromises = [];
      for (let i = 0; i < 100; i++) {
        const userId = (Math.floor(i) % 1000) + 1;
        updateUsernamePromises.push(
          request(app)
            .post(`/user/updateUsername`)
            .set("Authorization", `Bearer user${userId}Token`)
            .send({ newUsername: `updatedUser${userId}` })
        );
      }
      await Promise.all(updateUsernamePromises);
      const updateUsernameEndTime = Date.now();
      console.log(
        `Update username (100 users): ${
          updateUsernameEndTime - updateUsernameStartTime
        }ms`
      );

      // Update password for 100 users
      const updatePasswordStartTime = Date.now();
      const updatePasswordPromises = [];
      for (let i = 0; i < 100; i++) {
        const userId = (Math.floor(i) % 1000) + 1;
        updatePasswordPromises.push(
          request(app)
            .post(`/user/updatePassword`)
            .set("Authorization", `Bearer user${userId}Token`)
            .send({
              currentPassword: `password${userId}`,
              newPassword: `newPassword${userId}`,
            })
        );
      }
      await Promise.all(updatePasswordPromises);
      const updatePasswordEndTime = Date.now();
      console.log(
        `Update password (100 users): ${
          updatePasswordEndTime - updatePasswordStartTime
        }ms`
      );
    },
    1000 * 60 * 60
  );
});
