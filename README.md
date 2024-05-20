<p align="center"><img src="https://github.com/ImMattic/vidsplit/blob/dev/vidsplit/frontend/src/assets/vidsplit-logo-dark-mode.png" width="500" height=auto /></p>

## Description
A video download web app that allows you to splice together multiple segments of a video without the need for video editing software.

Main tutorial being used: https://www.youtube.com/watch?v=JD-age0BPVo&list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j

## Tasks
### Phase 1 - Beta
- [ ] Support for Youtube videos
- [ ] Discord and Google OAuth with whitelist
- [ ] Internal API setup
- [ ] Authentication screen and establishment of sessions to not allow access from the public
- [ ] Nice looking and clean interface with a simple logo at the center top and a box to put in the URL
- [ ] Ability to download the entire video or up to 10 segements
- [ ] Ability to put in the segment timestamps up 
- [ ] Ability to download video in multiple resolutions (360p, 480p, 720p, 1080p)
- [ ] Ability to preview each segment to make sure they line up properly

### Phase 2 - Public release
- [ ] Ensuring web app security best practices are put in place
- [ ] Google Cloud vertical scaling with Computer Engine and/or Cloud Run
- [ ] Ensuring Google Cloud resources can't be abused and that there automated processes to stop excess billing (see video: https://www.youtube.com/watch?v=KiTg8RPpGG4)
- [ ] Removal of authentication screen from home screen and beta tag from logo
- [ ] Addition of CAPTCHA to prevent bots from abusing resources

### Phase 3 - Additional features
- [ ] Support for Reddit and Twitter
- [ ] Ability to re-arrange order of segments
- [ ] Ability to splice in segments from other videos
- [ ] SponsorBlock implementation to quickly remove ad spots
- [ ] Public API to not require the need to go through GUI
- [ ] Accounts to save video segments to account

## Stack
### Front End
- ReactJS
- Javascript

### Back End
- Python
- Django

### Database
- SQLite

### Authentication
- Firebase Authentication

# Logic
![Logic diagram](https://github.com/ImMattic/vidsplit/blob/dev/assets/VidSplit-backend-logic.png)

# API Endpoints
![API Endpoint diagram](https://github.com/ImMattic/vidsplit/blob/dev/assets/vidsplit_api_endpoints.png)
