Scan the mongodb local database: mongodb://localhost:27017/videoPlatform
Scan the videos
If a video doesn't have subtitles, then take that video whole

Input: videourl, language 
1 Download the video and determine quality
2 Extract audio  
2 Determine the quality and go like 1080p, 720p, 360p
3 upload to cloudflare with these and get access urls
4 get subtitle with fast whisper
5 use argos for chinese and english subtitles
6 upload these subtitles to cloudflare and get access urls
7 write everything back to local mongodb
8 Clean up local