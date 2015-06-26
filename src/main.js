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

binaries.valid().then(function () {
    TEST_URLS.forEach(url => {
        ytdl.downloadAudio(url, (err, state, progress) => {
            if (err) {
                throw new Error(err);
            }
            if (state) {
                console.log(state);
            }
            if (progress) {
                console.log(progress);
            }
        })
    });
}, function (err) {
    console.error(err);
});