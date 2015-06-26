'use strict';

let ytdl = require('./youtube-downloader');
let binaries = require('./binaries');

const BINARIES = require('yamljs').load('conf.yml').binaries;
const YOUTUBEDL_BINARY = __dirname + '/../' + BINARIES.youtubeDl;
const FFMPEG_BINARY = __dirname + '/../' + BINARIES.ffmpeg;
const FFPROBE_BINARY = __dirname + '/../' + BINARIES.ffprobe;

const TEST_URLS = [
    'http://www.youtube.com/watch?v=lWA2pjMjpBs',
    'https://www.youtube.com/watch?v=tg00YEETFzg',
    'https://www.youtube.com/watch?v=pa14VNsdSYM',
    'https://www.youtube.com/watch?v=U0CGsw6h60k',
    'https://www.youtube.com/watch?v=J3UjJ4wKLkg'
];

binaries.valid(YOUTUBEDL_BINARY, FFMPEG_BINARY, FFPROBE_BINARY, err => {
    if (err) {
        throw new Error('Binaries are invalid: ' + err);
    }
    TEST_URLS.forEach(url => ytdl.downloadAudio(url,
            state => console.log(state),
            progress => console.log(progress),
            error => {
            throw new Error(error);
        }));
});