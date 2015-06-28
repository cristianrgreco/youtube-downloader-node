'use strict';

let ytdl = require('./youtube-downloader');
let binaries = require('./binaries');

const TEST_URLS = [
    'http://www.youtube.com/watch?v=lWA2pjMjpBs',
    'https://www.youtube.com/watch?v=tg00YEETFzg',
    'https://www.youtube.com/watch?v=pa14VNsdSYM',
    'https://www.youtube.com/watch?v=U0CGsw6h60k',
    'https://www.youtube.com/watch?v=J3UjJ4wKLkg'
];

binaries.valid().then(() => {
    TEST_URLS.forEach(url => {
        let download = ytdl.downloadAudio(url);
        download.on('state', state => console.log(state));
        download.on('progress', progress => console.log(progress));
        download.on('error', error => console.error(error));
    });
}, err => {
    console.error('Binaries are invalid: ' + err);
});