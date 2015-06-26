'use strict';

let state = require('./state');
let progress = require('./progress');
let spawn = require('child_process').spawn;

const BINARIES = require('yamljs').load('conf.yml').binaries;
const YOUTUBEDL_BINARY = __dirname + '/../' + BINARIES.youtubeDl;
const FFMPEG_BINARY = __dirname + '/../' + BINARIES.ffmpeg;

const OUTPUT_FILENAME_FORMAT = '%(title)s_%(id)s.%(ext)s';
const OUTPUT_VIDEO_FORMAT = 'mp4';
const OUTPUT_AUDIO_FORMAT = 'mp3';

exports.title = function (url, callback) {
    let process = spawn(YOUTUBEDL_BINARY, [
        '--get-title',
        '--encoding', 'UTF-8',
        '--no-part',
        '--no-playlist',
        url]);
    return output(process, callback);
};

exports.filename = function (url, callback) {
    let process = spawn(YOUTUBEDL_BINARY, [
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

exports.downloadVideo = function (url, stateChangeCallback, progressUpdateCallback) {
    let process = spawn(YOUTUBEDL_BINARY, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        url]);
    return download(process, stateChangeCallback, progressUpdateCallback);
};

exports.downloadAudio = function (url, stateChangeCallback, progressUpdateCallback) {
    let process = spawn(YOUTUBEDL_BINARY, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        '--extract-audio',
        '--audio-format', OUTPUT_AUDIO_FORMAT,
        '--ffmpeg-location', FFMPEG_BINARY,
        url]);
    return download(process, stateChangeCallback, progressUpdateCallback);
};

function download(process, stateChangeCallback, progressUpdateCallback) {
    process.stdout.setEncoding('UTF-8');
    process.stderr.setEncoding('UTF-8');

    if (stateChangeCallback || progressUpdateCallback) {
        let currentState = state.NONE;
        process.stdout.on('data', data => {
            if (stateChangeCallback && state.isValid(data)) {
                let newState = state.of(data);
                if (currentState !== newState) {
                    currentState = newState;
                    stateChangeCallback(newState);
                }
            }
            if (progressUpdateCallback && progress.isValid(data)) {
                let newProgress = progress.of(data);
                progressUpdateCallback(newProgress);
            }
        });
    }

    let err = '';
    process.stderr.on('data', data => {
        if (!isWarning(data)) {
            err += data;
        } else {
            console.error(data);
        }
    });

    process.on('close', () => {
        if (err) {
            throw new Error('An error has occurred: ' + err);
        }
        if (stateChangeCallback) {
            stateChangeCallback(state.COMPLETE);
        }
    });
}

function isWarning(err) {
    return err.lastIndexOf('WARNING:', 0) === 0;
}