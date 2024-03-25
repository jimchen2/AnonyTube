const request = require("supertest");
const app = require("../../server"); // Make sure this points to your server file
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
    // console.log(userResponse.body);
    testUser = userResponse.body.user.username;
    authToken = userResponse.body.token;
  });

  afterEach(async () => {
    // Clean up the database after each test
    await mongoose.connection.db.dropDatabase();
  });

  describe("POST /video/create", () => {
    it("should create a new video", async () => {
      const videoData = {
        previewimageurl: "https://example.com/preview.jpg",
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        tags: ["test", "video"],
        description: "A test video",
        duration: 120,
        title: "Test Video",
      };

      const response = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      expect(response.status).toBe(201);
      expect(response.body.video.previewimageurl).toBe(
        videoData.previewimageurl
      );
      expect(response.body.video.videourl[0].quality).toBe(
        videoData.videourl[0].quality
      );
      expect(response.body.video.videourl[0].url).toBe(
        videoData.videourl[0].url
      );
      expect(response.body.video.tags).toEqual(videoData.tags);
      expect(response.body.video.description).toBe(videoData.description);
      expect(response.body.video.duration).toBe(videoData.duration);
      expect(response.body.video.title).toBe(videoData.title);
    });
    it("should create a new video with missing optional fields", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      const response = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      expect(response.status).toBe(201);
      expect(response.body.video.previewimageurl).toBeUndefined();
      expect(response.body.video.videourl[0].quality).toBe(
        videoData.videourl[0].quality
      );
      expect(response.body.video.videourl[0].url).toBe(
        videoData.videourl[0].url
      );
      // expect(response.body.video.tags).toBeUndefined(); its []
      // expect(response.body.video.description).toBeUndefined(); its null
      expect(response.body.video.duration).toBe(videoData.duration);
      expect(response.body.video.title).toBe(videoData.title);
    });
    it("should create a new video with empty optional fields", async () => {
      const videoData = {
        previewimageurl: "",
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        tags: [],
        description: "",
        duration: 120,
        title: "Test Video",
      };

      const response = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      expect(response.status).toBe(201);
      expect(response.body.video.previewimageurl).toBe("");
      expect(response.body.video.videourl[0].quality).toBe(
        videoData.videourl[0].quality
      );
      expect(response.body.video.videourl[0].url).toBe(
        videoData.videourl[0].url
      );
      expect(response.body.video.tags).toEqual([]);
      expect(response.body.video.description).toBe("");
      expect(response.body.video.duration).toBe(videoData.duration);
      expect(response.body.video.title).toBe(videoData.title);
    });
    it("should create a new video with multiple video URLs", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
          { quality: "high", url: "https://example.com/video_high.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };

      const response = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      expect(response.status).toBe(201);
      expect(response.body.video.videourl.length).toBe(2);
      expect(response.body.video.videourl[0].quality).toBe(
        videoData.videourl[0].quality
      );
      expect(response.body.video.videourl[0].url).toBe(
        videoData.videourl[0].url
      );
      expect(response.body.video.videourl[1].quality).toBe(
        videoData.videourl[1].quality
      );
      expect(response.body.video.videourl[1].url).toBe(
        videoData.videourl[1].url
      );
      expect(response.body.video.duration).toBe(videoData.duration);
      expect(response.body.video.title).toBe(videoData.title);
    });
    it("shouldn't create a video with missing fields", async () => {
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
          { quality: "high", url: "https://example.com/video_high.mp4" },
        ],
        // duration: 120,
        title: "Test Video",
      };

      const response = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      expect(response.status).toBe(400);
      // let dsafasdf = await mongoose.model("Video").find({}); // Adjust 'User' to your actual model name if different

      // // Print the users to the console
      // console.log(JSON.stringify(dsafasdf, null, 2));
    });
  });

  describe("GET /video/get/:uuid", () => {
    it("should retrieve a video by UUID", async () => {
      const videoData = {
        previewimageurl: "https://example.com/preview.jpg",
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        tags: ["test", "video"],
        description: "A test video",
        duration: 120,
        title: "Test Video",
      };

      // Create a video via the /video/create route
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);

      const videoUuid = createResponse.body.video.uuid;

      const response = await request(app).get(`/video/get/${videoUuid}`);

      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(videoUuid);
      expect(response.body.previewimageurl).toBe(videoData.previewimageurl);
      expect(response.body.videourl).toEqual(videoData.videourl);
      expect(response.body.tags).toEqual(videoData.tags);
      expect(response.body.description).toBe(videoData.description);
      expect(response.body.duration).toBe(videoData.duration);
      expect(response.body.title).toBe(videoData.title);
      // expect(response.body.uploaderuuid).toBe(testUser.useruuid);
    });
  });
  // Add more test cases for other video-related routes
});
