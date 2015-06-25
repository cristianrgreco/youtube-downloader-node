'use strict';

let ytdl = require('./youtube-downloader');

const TEST_URLS = [
    'http://www.youtube.com/watch?v=lWA2pjMjpBs',
    'https://www.youtube.com/watch?v=tg00YEETFzg',
    'https://www.youtube.com/watch?v=pa14VNsdSYM',
    'https://www.youtube.com/watch?v=U0CGsw6h60k',
    'https://www.youtube.com/watch?v=J3UjJ4wKLkg'
];

TEST_URLS.forEach(url => ytdl.downloadAudio(url, state => console.log(state), progress => console.log(progress)));