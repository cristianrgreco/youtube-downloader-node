'use strict';

let spawn = require('child_process').spawn;
let events = require('events');

let byline = require('byline');

let state = require('./state');
let progress = require('./progress');
let binaries = require('./binaries');

const OUTPUT_FILENAME_FORMAT = '%(title)s_%(id)s.%(ext)s';
const OUTPUT_VIDEO_FORMAT = 'mp4';
const OUTPUT_AUDIO_FORMAT = 'mp3';

exports.title = (url, callback) => {
    let process = spawn(binaries.paths.youtubeDl, [
        '--get-title',
        '--encoding', 'UTF-8',
        '--no-part',
        '--no-playlist',
        url]);
    return output(process, callback);
};

exports.filename = (url, callback) => {
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
        return callback(null, title.trim());
    });
}

exports.downloadVideo = url => {
    let process = spawn(binaries.paths.youtubeDl, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        url]);
    return download(process);
};

exports.downloadAudio = url => {
    let process = spawn(binaries.paths.youtubeDl, [
        '-o', OUTPUT_FILENAME_FORMAT,
        '--format', OUTPUT_VIDEO_FORMAT,
        '--no-part',
        '--no-playlist',
        '--extract-audio',
        '--audio-format', OUTPUT_AUDIO_FORMAT,
        '--ffmpeg-location', binaries.paths.ffmpeg,
        url]);
    return download(process);
};

function download(process) {
    process.stdout.setEncoding('UTF-8');
    process.stderr.setEncoding('UTF-8');

    let eventEmitter = new events.EventEmitter();

    let currentState = state.NONE;
    byline(process.stdout).on('data', data => {
        if (state.isValid(data)) {
            let newState = state.of(data);
            if (currentState !== newState) {
                currentState = newState;
                eventEmitter.emit('state', newState);
            }
        }
        if (progress.isValid(data)) {
            let newProgress = progress.of(data);
            eventEmitter.emit('progress', newProgress);
        }
    });

    let err = '';
    byline(process.stderr).on('data', data => {
        if (!isWarning(data)) {
            err += data;
        }
    });

    process.on('close', () => {
        if (err) {
            eventEmitter.emit('error', err);
        }
        eventEmitter.emit('state', state.COMPLETE);
        eventEmitter.emit('complete');
    });

    return eventEmitter;
}

function isWarning(err) {
    return err.lastIndexOf('WARNING:', 0) === 0;
}