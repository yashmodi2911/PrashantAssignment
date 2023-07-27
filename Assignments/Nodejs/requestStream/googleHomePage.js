const fs = require('fs');
const request = require('request');

const url = 'https://www.google.com';
const outputFile = 'google_homepage.html';

// Use request to download Google's homepage
request(url, (error, response, body) => {
  if (error) {
    console.error('Error downloading the page:', error.message);
    return;
  }

  if (response.statusCode !== 200) {
    console.error('Failed to download the page. Status code:', response.statusCode);
    return;
  }

  // Save the downloaded page to a file using fs
  fs.writeFile(outputFile, body, (err) => {
    if (err) {
      console.error('Error saving the file:', err.message);
    } else {
      console.log(`Google's homepage saved to ${outputFile}`);
    }
  });
});
