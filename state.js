'use strict';

exports.NONE = 0;
exports.RESOLVING = 1;
exports.DOWNLOADING = 2;
exports.CONVERTING = 3;
exports.COMPLETE = 4;

const RESOLVING_PATTERN = /^\[youtube]/;
const DOWNLOADING_PATTERN = /^\[download]/;
const CONVERTING_PATTERN = /^\[ffmpeg]/;
const VALID_STATE_MESSAGE = /^\[(youtube|download|ffmpeg)]/;

exports.isValid = function (state) {
    return VALID_STATE_MESSAGE.test(state);
};

exports.of = function (input) {
    if (RESOLVING_PATTERN.test(input)) {
        return this.RESOLVING;
    } else if (DOWNLOADING_PATTERN.test(input)) {
        return this.DOWNLOADING;
    } else if (CONVERTING_PATTERN.test(input)) {
        return this.CONVERTING;
    }
    throw new Error('Unable to parse: ' + input);
};