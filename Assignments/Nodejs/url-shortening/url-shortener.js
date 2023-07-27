const fs = require("fs");
const axios = require("axios");

const BITLY_API_KEY = "cc73a96a8b24c2e6de63f82f159b2c32710108a7";
const REBRANDLY_API_KEY = "a5d6da579e46437eb85779bbe81f8e7d";

const bitlyEndpoint = "https://api-ssl.bitly.com/v4/shorten";
const rebrandlyEndpoint = "https://api.rebrandly.com/v1/links";

async function shortenUrlBitly(longUrl) {
  const headers = {
    Authorization: `Bearer ${BITLY_API_KEY}`,
    "Content-Type": "application/json",
  };
  const data = {
    long_url: longUrl,
  };

  try {
    const response = await axios.post(bitlyEndpoint, data, { headers });
    return response.data.link;
  } catch (error) {
    console.error("Error shortening URL with Bitly:", error.message);
    console.error("Bitly API Response:", error.response.data);
    return null;
  }
}

async function shortenUrlRebrandly(url) {
  const headers = {
    "Content-Type": "application/json",
    apikey: REBRANDLY_API_KEY,
  };
  let linkRequest = {
    destination: url,
    domain: { fullName: "rebrand.ly" },
  };
  const apiCall = {
    method: "post",
    url: rebrandlyEndpoint,
    data: linkRequest,
    headers: headers,
  };
  let apiResponse = await axios(apiCall);
  let link = apiResponse.data;
  return link.shortUrl;
}

let urls = [];

fs.readFile("data.json", "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading data.json:", err.message);
    return;
  }

  try {
    // Parse the JSON data into an array
    urls = JSON.parse(data);

    // Now you can use the dataArray variable, which contains the JSON data as an array
    console.log("Data read from data.json:", urls);
    console.log(urls[0]);
    await main();
  } catch (error) {
    console.error("Error parsing JSON data:", error.message);
  }
});

async function main() {
  const modifiedBitlyUrls = await Promise.all(
    urls.map((url) => shortenUrlBitly(url.url))
  );
  const modifiedRebrandlyUrls = await Promise.all(
    urls.map((url) => shortenUrlRebrandly(url.url))
  );
  console.log(modifiedBitlyUrls);
  console.log(modifiedRebrandlyUrls);

  saveToCSV(urls,modifiedBitlyUrls,modifiedRebrandlyUrls)
}

function saveToCSV(originalUrls, bitlyUrls,rebrandlyUrls) {
    const data = originalUrls.map(({url, index}) => ({
      original_url: url,
      shortened_bitly_url: bitlyUrls[index-1],
      shortened_rebrandly_url: rebrandlyUrls[index-1]
    }));
  
    const csvString = 'original_url,shortened_bitly_url,shortened_rebrandly_url\n' +
      data.map(row => `${row.original_url},${row.shortened_bitly_url},${row.shortened_rebrandly_url}`).join('\n');
  
    fs.writeFileSync('shortened_urls.csv', csvString, 'utf-8');
    console.log('CSV file saved successfully!');
  }
