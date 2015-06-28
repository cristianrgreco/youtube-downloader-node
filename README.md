# YouTube Downloader

*This project serves as a NodeJS wrapper for the [youtube-dl](https://rg3.github.io/youtube-dl/) Python binary.*

## Usage

```
var ytdl = require('./youtube-downloader');

ytdl.title('https://www.youtube.com/watch?v=lWA2pjMjpBs', (err, title) => console.log(title));
ytdl.filename('https://www.youtube.com/watch?v=lWA2pjMjpBs', (err, filename) => console.log(filename));

let download = ytdl.downloadAudio(url);
download.on('state', state => console.log(state));
download.on('progress', progress => console.log(progress));
download.on('error', error => console.error(error));
```

## Setup

A total of **3** binaries are required: **youtube-dl**, **ffmpeg** and **ffprobe**; each of which can be downloaded from their
respective vendor websites. Once downloaded, update `conf.yml` to reflect the relative paths of these binaries.