// src/tests/searchVideos.test.js
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

  describe("GET /video/search", () => {
    it("should search videos based on title, tags, and description", async () => {
      const videoData1 = {
        videourl: [
          { quality: "default", url: "https://example.com/video1.mp4" },
        ],
        duration: 120,
        title: "Test Video 1",
        tags: ["tag1", "tag2"],
        description: "This is a test video",
      };

      const videoData2 = {
        videourl: [
          { quality: "default", url: "https://example.com/video2.mp4" },
        ],
        duration: 180,
        title: "Test Video 2",
        tags: ["tag2", "tag3"],
        description: "Another test video",
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

      const response = await request(app).get("/video/search?query=test");

      expect(response.status).toBe(200);
      expect(response.body.videos.length).toBe(2);
      //   expect(response.body.videos[0].title).toBe("Test Video 1");
      //   expect(response.body.videos[1].title).toBe("Test Video 2");
    });

    it("should sort videos based on views", async () => {
      const videoData1 = {
        videourl: [
          { quality: "default", url: "https://example.com/video1.mp4" },
        ],
        duration: 120,
        title: "Test Video 1",
        viewscount: 100,
        likecount: 10,
      };

      const videoData2 = {
        videourl: [
          { quality: "default", url: "https://example.com/video2.mp4" },
        ],
        duration: 180,
        title: "Test Video 2",
        viewscount: 200,
        likecount: 5,
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

      const response = await request(app).get("/video/search?sort=views");

      expect(response.status).toBe(200);
      expect(response.body.videos.length).toBe(2);
      //   expect(response.body.videos[0].title).toBe("Test Video 2");
      //   expect(response.body.videos[1].title).toBe("Test Video 1");
    });

    it("should filter videos based on uploader UUID", async () => {
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
      const createResponse1 = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData1);

      const createResponse2 = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData2);

      const uploaderuuid = createResponse1.body.video.uploaderuuid;

      const response = await request(app)
        .get("/video/search")
        .query({ uploaderuuid });

      expect(response.status).toBe(200);
      expect(response.body.videos.length).toBe(2);
      //   expect(response.body.videos[0].title).toBe("Test Video 1");
      //   expect(response.body.videos[1].title).toBe("Test Video 2");
    });




    it("should filter videos based on duration, upload date, language, and resolution", async () => {
      const videoData1 = {
        videourl: [{ quality: "720p", url: "https://example.com/video1.mp4" }],
        duration: 120,
        title: "Test Video 1",
        language: "en",
      };

      const videoData2 = {
        videourl: [{ quality: "1080p", url: "https://example.com/video2.mp4" }],
        duration: 180,
        title: "Test Video 2",
        language: "es",
      };

      // Create multiple videos via the /video/create route
      await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData1);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

      await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData2);

//         let dsafasdf = await mongoose.model("Video").find({}); // Adjust 'User' to your actual model name if different

// // Print the users to the console
// console.log(JSON.stringify(dsafasdf, null, 2));

      const response = await request(app)
        .get("/video/search")
        .query({
        //   durationMin: 150,
        //   durationMax: 200,
          uploadedAfter: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
          uploadedBefore: new Date().toISOString(),
          language: "es",
        });

      expect(response.status).toBe(200);
      expect(response.body.videos.length).toBe(1);
      expect(response.body.videos[0].title).toBe("Test Video 2");
    });
  });
});
