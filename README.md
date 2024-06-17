> This project has been archived and is no longer being developed or updated. 


There are lots of minor issues, but no serious bugs

## Lacking Features or Issues

- [ ] Upload FileName Encoding Problem
- [ ] Comments
- [ ] Reimplementation of parts of the backend
- [ ] User's homepage doesn't feature all videos (need to add paging)
- [ ] Use and configure local Mongodb to reduce lag
- [ ] Not use iframe for videos
- [ ] Backend worker needs to fix for horizontal video processing
- [ ] Video frame very ugly, needs to fix
- [ ] Tags under the video page should lead to search
- [ ] Front page random implementation bad, too slow
- [ ] Implement autoplay
- [ ] Implement playlists where users can add their own videos to playlists (but not others' videos), one video belongs to one playlist, each playlist will show up beside a video, and there is no need for playlist search
- [ ] Implement search for Users
- [ ] Add "watched" option for logged in Users, which filters out watched videos
- [ ] Add progress in videos, so for example in the url ?time=10s goes to the 10 second

## Security Vulnerabilities

This is a small app for personal use, and I didn't had the time for more secure implementations

- [ ] No CSRF
- [ ] No timestamps and nonce when logging in
- [ ] No encryption of the post request (e.g., user's password) when logging in
- [ ] No Cors
- [ ] Didn't store the token in Http-Only Cookie, instead stored it in Local Storage
- [ ] No Captchas Protection
- [ ] No MongoDB IP protection
