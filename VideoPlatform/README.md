### Video Data Structure

- **uuid**: Unique identifier for each video.
  - Example: `"unique_video_uuid"`
- **previewimageurl** (optional): URL to a preview image of the video.
  - Example: `"https://example.com/preview.jpg"`
- **videourl**: Array of video URLs with corresponding quality labels.
  - Example: `[["default", "https://example.com/video.mp4"], ["720p", "https://example.com/video_720p.mp4"], ["360p", "https://example.com/video_360p.mp4"]]`
- **subtitles** (optional): Array of objects containing subtitle language and URL pairs.
  - Example: `[{ language: "en", url: "https://example.com/subtitles_en.vtt" }, { language: "cn", url: "https://example.com/subtitles_cn.vtt" }]`
- **language**: Primary language of the video, with a default value of "en".
  - Example: `"en"`
- **title**: The title of the video.
  - Example: `"An Amazing Video"`
- **uploaderuuid**: UUID of the user who uploaded the video.
  - Example: `"123e4567-e89b-12d3-a456-426614174000"`
- **likes**: Array containing UUIDs of users who liked the video.
  - Example: `["uuid1", "uuid2"]`
- **views**: Array of objects with user UUIDs and the dates they viewed the video.
  - Example: `[{ useruuid: "user_uuid_1", dates: ["2023-01-01", "2023-01-02"] }, { useruuid: "user_uuid_2", dates: ["2023-01-03"] }]`
- **likecount**: Total number of likes.
  - Example: `2`
- **viewscount**: Total number of views.
  - Example: `5`
- **tags** (optional): Array of tags related to the video content.
  - Example: `["gaming", "sports"]`
- **description** (optional): Description of the video.
  - Example: `"This is a video about amazing gaming moments."`
- **duration**: Length of the video in seconds.
  - Example: `120`
- **flagged**: Boolean indicating if the video is flagged (e.g., for NSFW content). Default is false.
  - Example: `false`

### User Data Structure

- **useruuid**: Unique identifier for each user.
  - Example: `"unique_user_uuid"`
- **username** (unique): Username of the user.
  - Example: `"user123"`
- **passwordhash**: Hashed password with salt and pepper using ARGON2.
  - Example: `"argon2_hashed_password"`
- **userimageurl** (optional): URL to the user's profile image.
  - Example: `"https://example.com/profile.jpg"`
- **user's personal website/social media links** (optional): Array of URLs to the user's website or social media, each preceded by a name.
  - Example: `["Personal website", "https://wixsite.com/mysite", "YouTube", "https://www.youtube.com/channel/UC123456789", "Bilibili", "https://space.bilibili.com/12341212"]`
- **user's bio** (optional): Bio of the user.
  - Example: `"I love making videos about gaming."`
- **followers**: Array of UUIDs of users who follow this user.
  - Example: `["follower_uuid_1", "follower_uuid_2"]`
- **followercount**: Total number of followers.
  - Example: `2`
- **following**: Array of UUIDs of users this user follows.
  - Example: `["following_uuid_1", "following_uuid_2"]`
- **followingcount**: Total number of users this user is following.
  - Example: `2`
- **blocked**: Array of UUIDs of users that this user has blocked.
  - Example: `["blocked_user_uuid_1", "blocked_user_uuid_2"]`
- **blockedCount**: Total count of users blocked by this user.
  - Example: `2`
- **beingBlocked**: Array of UUIDs of users who have blocked this user.
  - Example: `["blocking_user_uuid_1", "blocking_user_uuid_2"]`
- **beingBlockedCount**: Total count of users who have blocked this user.
  - Example: `2`
- **creationdate**: Date the user account was created.
  - Example: `"2023-01-01"`
- **email/phone** (hashed with server's key + pepper hashed with ARGON2): Hashed email or phone number.
  - Example: `"argon2_hashed_contact_info"`
- **suspended**: Boolean indicating if the user is suspended. Default is false.
  - Example: `false`

### Comments Data Structure

- **commentId**: Unique identifier for each comment.
  - Example: `"unique_comment_uuid"`
- **videoUuid**: UUID of the video the comment is associated with.
  - Example: `"unique_video_uuid"`
- **userId**: UUID of the user who made the comment.
  - Example: `"unique_user_uuid"`
- **text**: The content of the comment.
  - Example: `"Great video!"`
- **likes**: Total number of likes for the comment.
  - Example: `15`
- **parentCommentId** (optional): UUID of the parent comment for nested comments. Only one level of nesting is allowed.
  - Example: `"parent_comment_uuid"`
- **date**: Timestamp when the comment was posted.
  - Example: `"2023-01-02T00:00:00.000Z"`

### Bullet Screens Data Structure

- **bulletScreenId**: Unique identifier for each bullet screen.
  - Example: `"unique_bulletscreen_uuid"`
- **videoUuid**: UUID of the video the bullet screen is associated with.
  - Example: `"unique_video_uuid"`
- **time**: The time offset in seconds from the start of the video when the bullet screen appears.
  - Example: `60` (appears at 1 minute)
- **text**: The content of the bullet screen.
  - Example: `"Awesome move!"`

### Indexing

- **Users Collection Indexing**:

  - `db.users.createIndex({ useruuid: 1 });`
  - `db.users.createIndex({ username: 1 });`
  - `db.users.createIndex({ 'contact.emailHashed': 1 });`
  - `db.users.createIndex({ 'contact.phoneHashed': 1 });`
  - `db.users.createIndex({ 'followercount': 1 });`
  - `db.users.createIndex({ 'suspended': 1 });`

- **Videos Collection Indexing**:

  - `database.collection('videos').createIndex({ videourl: 1 });`
  - `database.collection('videos').createIndex({ language: 1 });`
  - `database.collection('videos').createIndex({ title: 1 });`
  - `database.collection('videos').createIndex({ uploaderuuid: 1 });`
  - `database.collection('videos').createIndex({ viewscount: 1 });`
  - `database.collection('videos').createIndex({ tags: 1 });`
  - `database.collection('videos').createIndex({ description: 1 });`
  - `database.collection('videos').createIndex({ duration: 1 });`
  - `database.collection('videos').createIndex({ flagged: 1 });`

    <!-- // Comment Collection Indexes
    Comment.collection.createIndex({ videoUuid: 1 });
    Comment.collection.createIndex({ date: -1 });
    Comment.collection.createIndex({ likes: -1 });
    Comment.collection.createIndex({ parentCommentId: 1 }); -->
