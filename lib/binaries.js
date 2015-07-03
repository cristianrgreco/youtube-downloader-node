'use strict';

let spawn = require('child_process').spawn;

exports.paths = {};

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
