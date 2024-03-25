// src/tests/likevideo.test.js
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
    testUser = userResponse.body.user.username;
    authToken = userResponse.body.token;
  });

  afterEach(async () => {
    // Clean up the database after each test
    await mongoose.connection.db.dropDatabase();
  });

  // src/tests/getVideoLikes.test.js
  describe("GET /video/likes/:uuid", () => {
    it("should get video likes", async () => {
      // Create a video and add likes
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);
      const videoUuid = createResponse.body.video.uuid;
      await request(app)
        .post(`/video/like/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app).get(`/video/likes/${videoUuid}`);

      expect(response.status).toBe(200);
      expect(response.body.likes.length).toBe(1);
      expect(response.body.likecount).toBe(1);
    });
  });

  // src/tests/getVideoViews.test.js
  describe("GET /video/views/:uuid", () => {
    it("should get video views", async () => {
      // Create a video and add views
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);
      const videoUuid = createResponse.body.video.uuid;
      await request(app)
        .post(`/video/addView/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app).get(`/video/views/${videoUuid}`);

      expect(response.status).toBe(200);
      expect(response.body.views.length).toBe(1);
      expect(response.body.viewscount).toBe(1);
    });
  });

  // src/tests/isUserLiked.test.js
  describe("GET /video/isLiked/:uuid", () => {
    it("should check if user liked video", async () => {
      // Create a video and like it
      const videoData = {
        videourl: [
          { quality: "default", url: "https://example.com/video.mp4" },
        ],
        duration: 120,
        title: "Test Video",
      };
      const createResponse = await request(app)
        .post("/video/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(videoData);
      const videoUuid = createResponse.body.video.uuid;
      await request(app)
        .post(`/video/like/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      let dsafasdf = await mongoose.model("Video").find({}); // Adjust 'User' to your actual model name if different

    //   // Print the users to the console
    //   console.log(JSON.stringify(dsafasdf, null, 2));

      const response = await request(app)
        .get(`/video/isLiked/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.isLiked).toBe(true);
    });
  });
  describe("POST /video/like/:uuid", () => {
    it("should like a video", async () => {
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
        .post(`/video/like/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Video liked successfully");

      const getResponse = await request(app).get(`/video/get/${videoUuid}`);
      //   expect(getResponse.body.likes).toContain(testUser);
      expect(getResponse.body.likecount).toBe(1);

      const response2 = await request(app)
        .post(`/video/like/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);
      //   console.log(response2.status);
      expect(getResponse.body.likecount).toBe(1);
    });
  });

  describe("POST /video/unlike/:uuid", () => {
    it("should unlike a video", async () => {
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

      // Like the video first
      await request(app)
        .post(`/video/like/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .post(`/video/unlike/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Video unliked successfully");

      // Check if the video is unliked by the user
      const getResponse = await request(app).get(`/video/get/${videoUuid}`);
      //   expect(getResponse.body.likes).not.toContain(testUser);
      expect(getResponse.body.likecount).toBe(0);
    });
  });
  describe("POST /video/view/:uuid", () => {
    it("should add a video view", async () => {
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

      // User A adds a view
      const responseA1 = await request(app)
        .post(`/video/addView/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(responseA1.status).toBe(200);
      expect(responseA1.body.message).toBe("Video view added successfully");

      // User A tries to add another view immediately
      const responseA2 = await request(app)
        .post(`/video/addView/${videoUuid}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(responseA2.status).toBe(200);
      expect(responseA2.body.message).toBe("Video view not added");

      // Create another test user (User B)
      const userResponseB = await request(app)
        .post("/user/create")
        .send({ username: "testuser2", password: "testpass2" });
      const testUserB = userResponseB.body.user.username;
      const authTokenB = userResponseB.body.token;

      // User B adds a view
      const responseB = await request(app)
        .post(`/video/addView/${videoUuid}`)
        .set("Authorization", `Bearer ${authTokenB}`);

      expect(responseB.status).toBe(200);
      expect(responseB.body.message).toBe("Video view added successfully");

      // Check if the video views are added correctly
      const getResponse = await request(app).get(`/video/get/${videoUuid}`);
      expect(getResponse.body.views.length).toBe(2);
      //   expect(getResponse.body.views[0].useruuid).toBe(testUser);
      expect(getResponse.body.views[0].dates.length).toBe(1);
      //   expect(getResponse.body.views[1].useruuid).toBe(testUserB);
      expect(getResponse.body.views[1].dates.length).toBe(1);
      expect(getResponse.body.viewscount).toBe(2);
      let dsafasdf = await mongoose.model("Video").find({}); // Adjust 'User' to your actual model name if different

      // Print the users to the console
      //   console.log(JSON.stringify(dsafasdf, null, 2));
    });
  });
});
