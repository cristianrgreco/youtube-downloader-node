'use strict';

let testCase = require('nodeunit').testCase;

let progress = require('../lib/progress');

const VALID_PROGRESS_MESSAGE = '[download]  10.8% of 9.22MiB at  5.68MiB/s ETA 00:01';
const VALID_PROGRESS_MESSAGE_UNKNOWN = '[download]  21.7% of 9.22MiB at Unknown speed ETA Unknown ETA';
const INVALID_PROGRESS_MESSAGE = '[download] 10.8@ of 9.22MiB at  5.68MiB/s FTP 00:01';

module.exports = testCase({
    'parsePercentageComplete': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE).percentageComplete, '10.8', 'Percentage complete is correct');
        test.done();
    },

    'parseFileSize': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE).fileSize, '9.22MiB', 'File size is correct');
        test.done();
    },

    'parseDownloadSpeed': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE).downloadSpeed, '5.68MiB/s', 'Download speed is correct');
        test.done();
    },

    'parseDownloadSpeedUnknown': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE_UNKNOWN).downloadSpeed, 'Unknown', 'Unknown download speed is correct');
        test.done();
    },

    'parseEta': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE).eta, '00:01', 'ETA is correct');
        test.done();
    },

    'parseEtaUnknown': test => {
        test.expect(1);
        test.equals(progress.of(VALID_PROGRESS_MESSAGE_UNKNOWN).eta, 'Unknown', 'Unknown ETA is correct');
        test.done();
    },

    'throwsErrorIfUnableToParse': test => {
        test.expect(1);
        test.throws(() => progress.of(INVALID_PROGRESS_MESSAGE), Error, 'Throws error for invalid progress message');
        test.done();
    },

    'isValid': test => {
        test.expect(1);
        test.equals(progress.isValid(VALID_PROGRESS_MESSAGE), true, 'Progress message is valid');
        test.done();
    },

    'isInvalid': test => {
        test.expect(1);
        test.equals(progress.isValid(INVALID_PROGRESS_MESSAGE), false, 'Progress message is invalid');
        test.done();
    }
});
