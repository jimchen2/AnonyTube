// src/tests/updateVideo.test.js
const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Video Routes", () => {
  let mongoServer;
  let testUser;
  let authToken;

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
    // Create a test user and generate an auth token
    const userResponse = await request(app)
      .post("/user/create")
      .send({ username: "testuser", password: "testpass" });
    testUser = userResponse.body.user.username;
    authToken = userResponse.body.token;
  });

  afterEach(async () => {
    // Clean up the database after each test
    await mongoose.connection.db.dropDatabase();
  });

  describe("PATCH /video/update/:uuid", () => {
    it("should update a video", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      // Create a video via the /video/create route
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      const videoUuid = createResponse.body.video.uuid;

      const updatedVideoData = {
        title: "Updated Test Video",
        description: "This is an updated video",
      };

      const response = await request(app)
        .patch(`/video/update/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedVideoData);

      expect(response.status).toBe(200);
      expect(response.body.video.title).toBe("Updated Test Video");
      expect(response.body.video.description).toBe("This is an updated video");
    });
    it("should return an error if the user is not authorized to update the video", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      // Create a video via the /video/create route
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      const videoUuid = createResponse.body.video.uuid;

      // Create a different user and generate an auth token
      const userResponse = await request(app)
        .post("/user/create")
        .send({ username: "anotheruser", password: "anotherpass" });
      const anotherAuthToken = userResponse.body.token;

      const updatedVideoData = {
        title: "Updated Test Video",
      };

      const response = await request(app)
        .patch(`/video/update/${videoUuid}`)
        .set("Authorization", `Bearer ${anotherAuthToken}`)
        .send(updatedVideoData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Not authorized to update this video");
    });

    it("should return an error if trying to update the video uuid or uploader uuid", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      // Create a video via the /video/create route
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      const videoUuid = createResponse.body.video.uuid;

      const updatedVideoData = {
        uuid: "new-uuid",
        uploaderuuid: "new-uploader-uuid",
      };

      const response = await request(app)
        .patch(`/video/update/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedVideoData);
      let dsafasdf = await mongoose.model("Video").find({}); // Adjust 'User' to your actual model name if different

      // Print the users to the console
      console.log(JSON.stringify(dsafasdf, null, 2));

      expect(response.status).toBe(400);
      // expect(response.body.message).toBe(
      //   "Cannot update video uuid or uploader uuid"
      // );
    });
    it("should return an error if trying to update non-updatable fields", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      // Create a video via the /video/create route
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      const videoUuid = createResponse.body.video.uuid;

      const updatedVideoData = {
        likes: ["user1", "user2"],
        views: [{ useruuid: "user1", dates: [new Date()] }],
        flagged: true,
      };

      const response = await request(app)
        .patch(`/video/update/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedVideoData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Cannot update the following fields: likes, views, flagged"
      );
    });
  });
});
