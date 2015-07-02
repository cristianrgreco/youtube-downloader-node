'use strict';

let testCase = require('nodeunit').testCase;

let state = require('../src/state');

const RESOLVING_MESSAGE = "[youtube] oHg5SJYRHA0: Downloading webpage";
const DOWNLOADING_MESSAGE = "[download]   0.0% of 9.22MiB at Unknown speed ETA Unknown ETA";
const CONVERTING_MESSAGE = "[ffmpeg] Destination: RickRoll'D_oHg5SJYRHA0.mp3";

const VALID_PROGRESS_MESSAGE = "[download]   0.0% of 9.22MiB at Unknown speed ETA Unknown ETA";
const INVALID_PROGRESS_MESSAGE_1 = "[invalid]   0.0% of 9.22MiB at Unknown speed ETA Unknown ETA";
const INVALID_PROGRESS_MESSAGE_2 = "Deleting original file C:\\Users\\crgreco\\Desktop\\RickRoll'D_oHg5SJYRHA0.mp4";

module.exports = testCase({
    'parseResolving': test => {
        test.expect(1);
        test.equals(state.of(RESOLVING_MESSAGE), state.RESOLVING, 'State is resolving');
        test.done();
    },

    'parseDownloading': test => {
        test.expect(1);
        test.equals(state.of(DOWNLOADING_MESSAGE), state.DOWNLOADING, 'State is downloading');
        test.done();
    },

    'parseConverting': test => {
        test.expect(1);
        test.equals(state.of(CONVERTING_MESSAGE), state.CONVERTING, 'State is converting');
        test.done();
    },

    'throwsErrorIfUnableToParse': test => {
        test.expect(1);
        test.throws(() => state.of(INVALID_PROGRESS_MESSAGE_1), Error, 'Throws error for invalid state');
        test.done();
    },

    'isValid': test => {
        test.expect(1);
        test.equals(state.isValid(VALID_PROGRESS_MESSAGE), true, 'State is valid');
        test.done();
    },

    'isInvalid': test => {
        test.expect(2);
        test.equals(state.isValid(INVALID_PROGRESS_MESSAGE_1), false, 'State is invalid');
        test.equals(state.isValid(INVALID_PROGRESS_MESSAGE_2), false, 'State is invalid');
        test.done();
    }
});