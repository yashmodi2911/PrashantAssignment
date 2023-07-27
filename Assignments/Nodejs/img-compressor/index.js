const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageUrls = [
  "http://sousmonarbre.com/qphj/bd963843d2239ed78aa6f7b0a36b537d/qdp/shapely-table-mat-design-office-bay-decoration-mes-at-work-decorating-ideas-office-decoration-mes-design-ideas-cream-wall-paint-decoration-messroom-wooden-laminate-ing-tosca-color__office-decorating-ideas.jpg",
  "https://doodleart.redbull.com/assets/managed/entries/processed/sm/367010617181759_36211000.jpg",
  "https://www.justcolor.net/wp-content/uploads/sites/1/nggallery/doodle-art-doodling/coloring-page-adults-doodle-art-rachel.jpg",
  "https://i.pinimg.com/originals/e5/55/a3/e555a39ca5457a079a9bcce59f61f8d5.jpg",
  "http://canhotopazelite.info/wp-content/uploads/2018/08/office-bay-decoration-themes-with-office-bay-decoration-themes-elegant-yet-fun-office-bay-decoration-14.jpg",
  "https://i.pinimg.com/originals/ef/4c/91/ef4c91fb73e61e19211a0589187ccaa6.jpg",
  "https://static.vecteezy.com/system/resources/previews/000/107/464/non_2x/huge-doodle-vector-pack.jpg",
  "https://i.ytimg.com/vi/O5u1apUkYV0/maxresdefault.jpg",
  "https://media.glassdoor.com/l/e9/c1/7a/84/independence-day-celebration.jpg",
];

const MAX_IMAGES_PER_FOLDER = 5;
const OUTPUT_FOLDER = 'compressed_images';

function createFolderIfNotExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

async function downloadAndCompressImage(url, index) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const compressedImageBuffer = await sharp(imageBuffer).jpeg({ quality: 50 }).toBuffer();

    const folderIndex = Math.floor(index / MAX_IMAGES_PER_FOLDER) + 1;
    const folderPath = path.join(OUTPUT_FOLDER, `Folder_${folderIndex}`);
    createFolderIfNotExists(folderPath);

    const imageName = `image_${index}.jpg`;
    const imagePath = path.join(folderPath, imageName);

    fs.writeFileSync(imagePath, compressedImageBuffer);
    console.log(`Image ${imageName} saved in ${folderPath}`);
  } catch (error) {
    console.error(`Error downloading or compressing image ${url}:`, error.message);
  }
}

async function main() {
  createFolderIfNotExists(OUTPUT_FOLDER);

  const downloadTasks = imageUrls.map((url, index) => downloadAndCompressImage(url, index));
  await Promise.all(downloadTasks);
}

main().catch(error => console.error('An error occurred:', error));
