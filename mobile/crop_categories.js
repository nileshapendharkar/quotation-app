const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function cropImages() {
  const imagesDir = path.join(__dirname, '../backend/public/images/categories');
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    try {
      console.log(`Processing ${file}...`);
      const img = await Jimp.read(filePath);
      img.autocrop();
      await img.writeAsync(filePath);
      console.log(`Autocropped ${file}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

cropImages().catch(err => console.error(err));
