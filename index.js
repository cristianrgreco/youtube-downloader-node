'use strict';

module.exports = binaries => {
    require('./lib/binaries').paths = binaries;
    return require('./lib/youtube-downloader');
};
