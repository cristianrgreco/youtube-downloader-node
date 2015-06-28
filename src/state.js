'use strict';

const RESOLVING_PATTERN = /^\[youtube]/;
const DOWNLOADING_PATTERN = /^\[download]/;
const CONVERTING_PATTERN = /^\[ffmpeg]/;
const VALID_STATE_MESSAGE = /^\[(youtube|download|ffmpeg)]/;

exports.NONE = {id: 0, text: 'NONE'};
exports.RESOLVING = {id: 1, text: 'RESOLVING'};
exports.DOWNLOADING = {id: 2, text: 'DOWNLOADING'};
exports.CONVERTING = {id: 3, text: 'CONVERTING'};
exports.COMPLETE = {id: 4, text: 'COMPLETE'};

exports.isValid = state => {
    return VALID_STATE_MESSAGE.test(state);
};

exports.of = input => {
    if (RESOLVING_PATTERN.test(input)) {
        return this.RESOLVING;
    } else if (DOWNLOADING_PATTERN.test(input)) {
        return this.DOWNLOADING;
    } else if (CONVERTING_PATTERN.test(input)) {
        return this.CONVERTING;
    }
    throw new Error('Unable to parse: ' + input);
};