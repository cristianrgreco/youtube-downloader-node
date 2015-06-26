'use strict';

const PERCENTAGE_COMPLETE_PATTERN = /([0-9.]+)/;
const FILE_SIZE_PATTERN = /of.*?([A-z0-9].+?) /;
const DOWNLOAD_SPEED_PATTERN = /at.*?(([A-z0-9].+?)|(Unknown)) /;
const ETA_PATTERN = /ETA.*?(([0-9:]+)|(Unknown))/;

exports.isValid = function (progress) {
    return PERCENTAGE_COMPLETE_PATTERN.test(progress) &&
        FILE_SIZE_PATTERN.test(progress) &&
        DOWNLOAD_SPEED_PATTERN.test(progress) &&
        ETA_PATTERN.test(progress);
};

exports.of = function (input) {
    if (!this.isValid(input)) {
        throw new Error('Unable to parse: ' + input);
    }
    return {
        percentageComplete: PERCENTAGE_COMPLETE_PATTERN.exec(input)[1],
        fileSize: FILE_SIZE_PATTERN.exec(input)[1],
        downloadSpeed: DOWNLOAD_SPEED_PATTERN.exec(input)[1],
        eta: ETA_PATTERN.exec(input)[1]
    };
};