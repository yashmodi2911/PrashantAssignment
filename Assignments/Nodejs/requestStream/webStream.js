const fs = require('fs');
const request = require('request');

const url = 'https://www.africau.edu/images/default/sample.pdf';
const outputFile = 'output_file.pdf';

const downloadStream = request(url);

const fileStream = fs.createWriteStream(outputFile);
downloadStream.pipe(fileStream);

downloadStream.on('response', (response) => {
  if (response.statusCode !== 200) {
    console.error('Failed to download the file. Status code:', response.statusCode);
    return;
  }

  console.log(`Streaming the file from ${url} to ${outputFile}`);
});

fileStream.on('finish', () => {
  console.log(`File saved to ${outputFile}`);
});

fileStream.on('error', (err) => {
  console.error('Error saving the file:', err.message);
});
