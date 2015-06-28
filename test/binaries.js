'use strict';

let testCase = require('nodeunit').testCase;

module.exports = testCase({
    'setUp': callback => {
        delete require.cache[require.resolve('../src/binaries')];
        this.binaries = require('../src/binaries');
        callback();
    },

    'allValid': test => {
        this.binaries.valid().then(() => test.done());
    },

    'isInvalidYouTubeDl': test => {
        this.binaries.paths.youtubeDl = this.binaries.paths.ffmpeg;
        this.binaries.valid().then(null, () => test.done());
    },

    'isInvalidFfmpeg': test => {
        this.binaries.paths.ffmpeg = this.binaries.paths.youtubeDl;
        this.binaries.valid().then(null, () => test.done());
    },

    'isInvalidFfprobe': test => {
        this.binaries.paths.ffprobe = this.binaries.paths.youtubeDl;
        this.binaries.valid().then(null, () => test.done());
    }
});