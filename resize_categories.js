const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function resizeImages() {
  const imagesDir = path.join(__dirname, '../backend/public/images/categories');
  const casingPath = path.join(imagesDir, 'cat_casing.png');
  
  console.log('Loading casing image...');
  const casingImg = await Jimp.read(casingPath);
  const targetWidth = casingImg.bitmap.width;
  const targetHeight = casingImg.bitmap.height;
  
  console.log(`Target size: ${targetWidth}x${targetHeight}`);
  
  const filesToResize = [
    'cat_swr.png',
    'cat_column.png',
    'cat_cpvc.png',
    'cat_upvc.png',
    'cat_eco_drainage.png'
  ];
  
  for (const file of filesToResize) {
    const filePath = path.join(imagesDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`Resizing ${file}...`);
      const img = await Jimp.read(filePath);
      img.resize(targetWidth, targetHeight);
      await img.writeAsync(filePath);
      console.log(`Successfully resized ${file}`);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
  
  console.log('All done!');
}

resizeImages().catch(err => console.error(err));
