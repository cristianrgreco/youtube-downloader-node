'use strict';

let fs = require('fs');
let testCase = require('nodeunit').testCase;

let ytdl = require('../src/youtube-downloader');
let state = require('../src/state');

const URL_SHORT = 'https://www.youtube.com/watch?gl=GB&hl=en-GB&v=oHg5SJYRHA0';
const URL_SPECIAL_ENCODING = 'https://www.youtube.com/watch?v=z-wi-HyaASc';
const URL_TITLE_SPECIAL_ENCODING = 'https://www.youtube.com/watch?v=jcF5HtGvX5I';
const URL_PLAYLIST = 'https://www.youtube.com/watch?v=YANRGTqELow&list=RDYANRGTqELow';
const URL_INVALID = 'https://www.youtube.com/watch?v=INVALIDURL';

const TEMP_FILES = [
    'RickRoll\'D_oHg5SJYRHA0.mp4',
    'RickRoll\'D_oHg5SJYRHA0.mp3',
    'PSY-GANGNAM STYLE(English Lyrics_subtitle) Emoticon   _z-wi-HyaASc.mp4',
    'PSY-GANGNAM STYLE(English Lyrics_subtitle) Emoticon 강남스타일 영어 가사_z-wi-HyaASc.mp4',
    'Coleccionista de canciones - Camila (Letra)_YANRGTqELow.mp4'
];

module.exports = testCase({
    'tearDown': callback => {
        for (let tempFile of TEMP_FILES) {
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
        callback();
    },

    'fetchesTitle': test => {
        test.expect(1);
        ytdl.title(URL_SHORT, (err, title) => {
            test.equals(title, 'RickRoll\'D', 'Title is correct');
            test.done();
        });
    },

    'fetchesTitleWithEncoding': test => {
        test.expect(1);
        ytdl.title(URL_TITLE_SPECIAL_ENCODING, (err, title) => {
            test.equals(title, 'Beyoncé - Yoncé', 'Title with encoding is correct');
            test.done();
        });
    },

    'fetchesFilename': test => {
        test.expect(1);
        ytdl.filename(URL_SHORT, (err, filename) => {
            test.equals(filename, 'RickRoll\'D_oHg5SJYRHA0.mp4', 'Filename is correct');
            test.done();
        });
    },

    'downloadsVideo': test => {
        test.expect(1);
        let download = ytdl.downloadVideo(URL_SHORT);
        download.on('complete', () => {
            test.equals(fs.existsSync('RickRoll\'D_oHg5SJYRHA0.mp4'), true, 'Video file exists');
            test.done();
        })
    },

    'downloadsAudio': test => {
        test.expect(2);
        let download = ytdl.downloadAudio(URL_SHORT);
        download.on('complete', () => {
            test.equals(fs.existsSync('RickRoll\'D_oHg5SJYRHA0.mp3'), true, 'Audio file exists');
            test.equals(fs.existsSync('RickRoll\'D_oHg5SJYRHA0.mp4'), false, 'Video file should not exist when downloading audio');
            test.done();
        });
    },

    'downloadsFilenameWithEncoding': test => {
        test.expect(1);
        let download = ytdl.downloadVideo(URL_SPECIAL_ENCODING);
        download.on('complete', () => {
            let videoFile1 = 'PSY-GANGNAM STYLE(English Lyrics_subtitle) Emoticon   _z-wi-HyaASc.mp4';
            let videoFile2 = 'PSY-GANGNAM STYLE(English Lyrics_subtitle) Emoticon 강남스타일 영어 가사_z-wi-HyaASc.mp4';
            test.equals(fs.existsSync(videoFile1) || fs.existsSync(videoFile2), true, 'Video file exists');
            test.done();
        });
    },

    'downloadsSingleEntryFromPlaylistInsteadOfAll': test => {
        test.expect(1);
        let download = ytdl.downloadVideo(URL_PLAYLIST);
        download.on('complete', () => {
            test.equals(fs.existsSync('Coleccionista de canciones - Camila (Letra)_YANRGTqELow.mp4'), true, 'Video file exists');
            test.done();
        });
    },

    'emitsStateEvents': test => {
        let download = ytdl.downloadVideo(URL_SHORT);
        download.on('state', newState => {
            if (newState === state.COMPLETE) {
                test.done();
            }
        });
    },

    'emitsProgressEvents': test => {
        let download = ytdl.downloadVideo(URL_SHORT);
        download.on('progress', progress => {
            if (progress.percentageComplete === '100.0') {
                test.done();
            }
        });
    },

    'emitsErrorEvents': test => {
        test.expect(1);
        let download = ytdl.downloadVideo(URL_INVALID);
        download.on('error', error => {
            test.equals(error, 'ERROR: Incomplete YouTube ID INVALIDURL. URL ' + URL_INVALID + ' looks truncated.')
            test.done();
        });
    },

    'emitsCompleteEvent': test => {
        let download = ytdl.downloadVideo(URL_SHORT);
        download.on('complete', () => test.done());
    }
});