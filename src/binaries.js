'use strict';

let spawn = require('child_process').spawn;

exports.valid = function (youtubeDl, ffmpeg, ffprobe, callback) {
    let processes = [spawn(youtubeDl, ['--version']), spawn(ffmpeg, ['-version']), spawn(ffprobe, ['-version'])];
    processes.forEach(process => {
        process.on('close', exitCode => {
            if (exitCode !== 0) {
                return callback('Failed with exit value: ' + exitCode);
            }
            return callback(null, true);
        })
    });
};