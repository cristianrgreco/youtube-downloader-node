'use strict';

let testCase = require('nodeunit').testCase;

let binaries = require('../src/binaries');

module.exports = testCase({
    'allValid': test => {
        binaries.valid().then(() => test.done());
    },

    'isInvalidYouTubeDl': test => {
        let defaultYoutubeDlPath = binaries.paths.youtubeDl;
        binaries.paths.youtubeDl = binaries.paths.ffmpeg;
        binaries.valid().then(null, () => {
            binaries.paths.youtubeDl = defaultYoutubeDlPath;
            test.done()
        });
    },

    'isInvalidFfmpeg': test => {
        let defaultFfmpegPath = binaries.paths.ffmpeg;
        binaries.paths.ffmpeg = binaries.paths.youtubeDl;
        binaries.valid().then(null, () => {
            binaries.paths.ffmpeg = defaultFfmpegPath;
            test.done()
        });
    },

    'isInvalidFfprobe': test => {
        let defaultFfprobePath = binaries.paths.ffprobe;
        binaries.paths.ffprobe = binaries.paths.youtubeDl;
        binaries.valid().then(null, () => {
            binaries.paths.ffprobe = defaultFfprobePath;
            test.done()
        });
    }
});