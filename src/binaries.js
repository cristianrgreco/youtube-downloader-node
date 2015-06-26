'use strict';

let spawn = require('child_process').spawn;

const BINARIES = require('yamljs').load('conf.yml').binaries;
const YOUTUBEDL_BINARY = BINARIES.youtubeDl;
const FFMPEG_BINARY = BINARIES.ffmpeg;
const FFPROBE_BINARY = BINARIES.ffprobe;

exports.paths = {
    youtubeDl: YOUTUBEDL_BINARY,
    ffmpeg: FFMPEG_BINARY,
    ffprobe: FFPROBE_BINARY
};

exports.valid = function () {
    let processes = [
        spawn(YOUTUBEDL_BINARY, ['--version']),
        spawn(FFMPEG_BINARY, ['-version']),
        spawn(FFPROBE_BINARY, ['-version'])
    ];
    let promises = processes.map(process => new Promise((resolve, reject) => {
        process.on('close', exitCode => {
            if (exitCode !== 0) {
                reject('Failed with exit value: ' + exitCode);
            }
            resolve();
        })
    }));
    return Promise.all(promises);
};