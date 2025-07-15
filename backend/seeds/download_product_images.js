const fs = require('fs');
const https = require('https');
const path = require('path');
const { imageDownloads } = require('./productSeeds');

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`File exists, skipping: ${dest}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(`Failed to get '${url}' (${response.statusCode})`);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
};

(async () => {
  for (const { url, filename } of imageDownloads) {
    const dest = path.resolve(__dirname, '..', 'uploads', 'products', path.basename(filename));
    try {
      console.log(`Downloading ${url} -> ${dest}`);
      await downloadImage(url, dest);
      console.log('Done');
    } catch (err) {
      console.error(`Error downloading ${url}: ${err}`);
    }
  }
  console.log('All downloads attempted.');
})(); 