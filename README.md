# YouTube Downloader

*This project serves as a NodeJS wrapper for the [youtube-dl](https://rg3.github.io/youtube-dl/) Python binary.*

## Usage

```
var ytdl = require('./youtube-downloader');

ytdl.title('https://www.youtube.com/watch?v=lWA2pjMjpBs', (err, title) => console.log(title));
ytdl.downloadAudio('https://www.youtube.com/watch?v=lWA2pjMjpBs', state => console.log(state), progress => console.log(progress));
```

## Setup

A total of **3** binaries are required: **youtube-dl**, **ffmpeg** and **ffprobe**; each of which can be downloaded from their
respective vendor websites. Once downloaded, update the `youtube-downloader.js` constants to reflect the path of these binaries.