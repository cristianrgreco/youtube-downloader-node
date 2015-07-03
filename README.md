# YouTube Downloader

*This project serves as a NodeJS wrapper for the [youtube-dl](https://rg3.github.io/youtube-dl/) Python binary.*

## Usage

```
let binaries = {youtubeDl: '/youtube-dl', ffmpeg: '/ffmpeg', ffprobe: '/ffprobe'};
let ytdl = require('youtube-downloader-node')(binaries);

ytdl.title('https://www.youtube.com/watch?v=lWA2pjMjpBs', (err, title) => console.log(title));
ytdl.filename('https://www.youtube.com/watch?v=lWA2pjMjpBs', (err, filename) => console.log(filename));

let download = ytdl.downloadAudio(url);
download.on('state', state => console.log(state));
download.on('progress', progress => console.log(progress));
download.on('error', error => console.error(error));
download.on('complete' () => console.log('Finished'));
```

## Setup

A total of **3** binaries are required: **youtube-dl**, **ffmpeg** and **ffprobe**; each of which can be downloaded from their
respective vendor websites. Once downloaded, update `conf.yml` to reflect the relative paths of these binaries.
