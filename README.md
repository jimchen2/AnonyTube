Currently in Beta

There are lots of minor issues, but no serious bugs

## ToDo List(including Issues):

- [ ] Comments
- [ ] Reimplementation of parts of the backend
- [ ] User's homepage doesn't feature all videos (need to add paging)
- [ ] Use and configure local Mongodb to reduce lag
- [ ] Implement local Mongodb backup to Cloudflare R2
- [ ] Not use iframe for videos
- [ ] Backend worker needs to fix for horizontal video processing
- [ ] Video frame very ugly, needs to fix
- [ ] Tags under the video page should lead to search
- [ ] Front page random implementation bad, too slow
- [ ] Implement autoplay
- [ ] Put configuration in `.env` instead of `config.py` or `config.js`
- [ ] Implement playlists where users can add their own videos to playlists (but not others' videos), one video belongs to one playlist, each playlist will show up beside a video, and there is no need for playlist search
- [ ] Implement search for Users
- [ ] Add "watched" option for logged in Users, which filters out watched videos
- [ ] Add progress in videos, so for example in the url ?time=10s goes to the 10 second
