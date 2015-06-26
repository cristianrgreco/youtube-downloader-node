'use strict';

let state = require('./state');
let progress = require('./progress');
let binaries = require('./binaries');
let spawn = require('child_process').spawn;

const OUTPUT_FILENAME_FORMAT = '%(title)s_%(id)s.%(ext)s';
const OUTPUT_VIDEO_FORMAT = 'mp4';
const OUTPUT_AUDIO_FORMAT = 'mp3';

exports.title = function (url, callback) {
    let process = spawn(binaries.paths.youtubeDl, [
        '--get-title',
        '--encoding', 'UTF-8',
        '--no-part',
        '--no-playlist',
        url]);
    return output(process, callback);
};

exports.filename = function (url, callback) {
    let process = spawn(binaries.paths.youtubeDl, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--get-filename',
        '--encoding', 'UTF-8',
        '--no-part',
        '--no-playlist',
        url]);
    return output(process, callback);
};

function output(process, callback) {
    process.stdout.setEncoding('UTF-8');
    process.stderr.setEncoding('UTF-8');

    let title = '';
    process.stdout.on('data', data => title += data);

    let err = '';
    process.stderr.on('data', data => err += title);

    process.on('close', () => {
        if (err) {
            return callback(err);
        }
        return callback(null, title);
    });
}

exports.downloadVideo = function (url, callback) {
    let process = spawn(binaries.paths.youtubeDl, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        url]);
    return download(process, callback);
};

exports.downloadAudio = function (url, callback) {
    let process = spawn(binaries.paths.youtubeDl, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        '--extract-audio',
        '--audio-format', OUTPUT_AUDIO_FORMAT,
        '--ffmpeg-location', binaries.paths.ffmpeg,
        url]);
    return download(process, callback);
};

function download(process, callback) {
    process.stdout.setEncoding('UTF-8');
    process.stderr.setEncoding('UTF-8');

    if (callback) {
        let currentState = state.NONE;
        process.stdout.on('data', data => {
            if (state.isValid(data)) {
                let newState = state.of(data);
                if (currentState !== newState) {
                    currentState = newState;
                    callback(null, newState);
                }
            }
            if (progress.isValid(data)) {
                let newProgress = progress.of(data);
                callback(null, null, newProgress);
            }
        });
    }

    let err = '';
    process.stderr.on('data', data => {
        if (!isWarning(data)) {
            err += data;
        }
    });

    process.on('close', () => {
        if (callback && err) {
            callback(err);
        }
        return callback(null, state.COMPLETE);
    });
}

function isWarning(err) {
    return err.lastIndexOf('WARNING:', 0) === 0;
}