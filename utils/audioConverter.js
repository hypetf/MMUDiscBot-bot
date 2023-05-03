const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');
const { createWriteStream } = require('node:fs');

function convertAudio(stream, outputFile) {
  return new Promise((resolve, reject) => {
    const passThroughStream = new PassThrough();

    ffmpeg(stream)
      .inputFormat('s16le')
      .audioFrequency(48000)
      .audioChannels(2)
      .outputFormat('mp3')
      .outputOptions('-af', 'asetrate=48000*2,atempo=2')
      .on('end', () => {
        console.log('Conversion complete!');
        resolve(outputFile);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .pipe(passThroughStream);

    passThroughStream.pipe(createWriteStream(outputFile));
  })
  .then(outputFile => {
    return outputFile;
  });
}

module.exports = {
  convertAudio
};
