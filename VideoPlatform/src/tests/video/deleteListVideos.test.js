// src/tests/deleteListVideos.test.js
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

  describe("DELETE /video/delete/:uuid", () => {
    it("should delete a video", async () => {
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

      const response = await request(app)
        .delete(`/video/delete/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Video deleted successfully");

      const getResponse = await request(app).get(`/video/get/${videoUuid}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe("GET /video/list", () => {
    it("should list all videos", async () => {
      const videoData1 = {
        videourl: [
          { quality: "default", url: "https://example.com/video1.mp4" },
        ],
        duration: 120,
        title: "Test Video 1",
      };

      const videoData2 = {
        videourl: [
          { quality: "default", url: "https://example.com/video2.mp4" },
        ],
        duration: 180,
        title: "Test Video 2",
      };

      // Create multiple videos via the /video/create route
      await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData1);

      await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData2);

      const response = await request(app).get("/video/list");

      expect(response.status).toBe(200);
      expect(response.body.videos.length).toBe(2);
      expect(response.body.videos[0].title).toBe("Test Video 1");
      expect(response.body.videos[1].title).toBe("Test Video 2");
    });
  });
});
