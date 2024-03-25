video:

uuid:
previewimageurl(optional):
videourl:["default",""],["720p",""],["360p",""]...
  subtitles(default to none): [
    { language: "en", url: "url_to_english_subtitle.vtt" },
    { language: "cn", url: "url_to_chinese_subtitle.vtt" },
    { language: "ru", url: "url_to_russian_subtitle.vtt" },
    { language: "es", url: "url_to_spanish_subtitle.vtt" },
    # ... Add as many as needed ...
  ]

language(single, value, defaults to en):"en" OR "cn" OR ...
title:
uploaderuuid:
likes:[likeduser's uuid list]
  views: [
    { useruuid: "user_uuid_1", dates: ["2023-01-01", "2023-01-02"] }, # Assuming a user may watch on different days
    { useruuid: "user_uuid_2", dates: ["2023-01-03"] },
    # ... etc ...
  ]

likecount:
viewscount:
tags:(optional)[gaming,sports, programming, python...]
description(optional)
duration:
flagged(default false):bool(flagged if nsfw, or uploading political videos, if flagged then video is not visible and undergos server administrator's manual 	


user:
useruuid:
username(unique):
passwordhash(with salt and pepper and ARGON2):
userimageurl(optional):
videosarray:[videouuid]
user's personal website/social media links(optional):[https://space.bilibili.com/12341212,https://www.youtube.com/channel/sdfsafasfd,https://wixsite.com/safsd]
user's bio(optional):
followers:[uuids]
followercount:
following:[uuids]
followingcount:
creationdate:
email/phone(hashed with server's key+pepper hased with ARGON2):
suspended(default false): true if user uploads nsfw videos, suspends users accounts

indexing:


db.users.createIndex({ useruuid: 1 });
db.users.createIndex({ username: 1 });
db.users.createIndex({ 'contact.emailHashed': 1 });
db.users.createIndex({ 'contact.phoneHashed': 1 });
db.users.createIndex({ 'followercount': 1 });
db.users.createIndex({ 'suspended': 1 });

database.collection('videos').createIndex({ videourl: 1 });
database.collection('videos').createIndex({ language});
database.collection('videos').createIndex({ title });
database.collection('videos').createIndex({ uploaderuuid});
database.collection('videos').createIndex({ viewscount });
database.collection('videos').createIndex({  tags
database.collection('videos').createIndex({  description
database.collection('videos').createIndex({  duration
database.collection('videos').createIndex({  flagged
