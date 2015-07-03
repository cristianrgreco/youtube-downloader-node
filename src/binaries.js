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

exports.valid = () => {
    let processes = [
        spawn(this.paths.youtubeDl, ['--version']),
        spawn(this.paths.ffmpeg, ['-version']),
        spawn(this.paths.ffprobe, ['-version'])
    ];
    let promises = processes.map(process => new Promise((resolve, reject) => {
        process.on('close', exitCode => {
            if (exitCode !== 0) {
                reject('Failed with exit value of ' + exitCode);
            }
            resolve();
        })
    }));
    return Promise.all(promises);
};
