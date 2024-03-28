export const aboutContent = `

## About AnonyTube

AnonyTube is a free and liberal video platform dedicated to providing an open-source environment for watching and uploading videos with minimal restrictions. Currently in beta for a small community.

### Unique Features

- Totally FREE & AdFree
- Automatic subtitles creation using [Faster Whisper](https://github.com/SYSTRAN/faster-whisper)
- Video translation into English and Chinese with [nllb-200-distilled](https://huggingface.co/facebook/nllb-200-distilled-600M)
- Free video downloads
- One-click Signup
- Integrated Dark Theme

### Terms of Service

To maintain a safe and respectful community, we do not allow the following content:

- NSFW/Adult
- Political
- Copyright violations
- Gore or violent content
- Disrespect or hatred 

### Information & Contact

For feedback, reporting issues, or just to say hi!

- Source code: [https://github.com/jimchen2/AnonyTube](https://github.com/jimchen2/AnonyTube)
- Email: [jimchen4214@gmail.com](mailto:jimchen4214@gmail.com)
- WeChat: [Contact via WeChat](https://www.jimchen.me/w.JPG)
- Website: [https://jimchen.me/](https://jimchen.me)
    
## Q&A

### Is my password safe with AnonyTube?

Non-technical: Your password is securely encrypted and protected. Even we cannot see or access it.

Technical: We use Argon2 hashing with a secure pepper to make your password virtually uncrackable.

### What data is collected by AnonyTube?

Non-technical: We collect basic info like your username, profile picture, and bio. (only everything you provide)

Technical: User data is stored according to our schema. Sensitive info is hashed with Argon2 and server pepper. UUIDs are used for identification, and cannot be changed.

### Does the website track me?

Non-technical: No, we don't track you or collect any information about your online activities.

Technical: We don't log IPs or use any client-side tracking like cookies or fingerprinting. We only use a session token for identification.

### How can I delete my data?

Delete your account to remove all your info and videos.

### Is there an upload size limit?

Non-technical: No overall limit, but individual videos are limited to 5 GB per upload. Split larger videos into parts.

Technical: We use S3 presigned URLs on the client side for uploads, each allowing 5 GB. Use chunked uploads for larger videos. No total storage limit.

### How is my video processed?

It is processed with a backend worker, so your video's subtitles and different qualities will be available a short time after upload. It takes around 2-3 times the video length to process it on 8GB Linode, given no other videos in queue.

`;
