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
      // Proportional scale to preserve true aspect ratio without stretching
      const scale = Math.min(targetWidth / img.bitmap.width, targetHeight / img.bitmap.height);
      const newW = Math.round(img.bitmap.width * scale);
      const newH = Math.round(img.bitmap.height * scale);
      img.resize(newW, newH);

      const canvas = new Jimp(targetWidth, targetHeight, 0x00000000);
      const offsetX = Math.round((targetWidth - newW) / 2);
      const offsetY = Math.round((targetHeight - newH) / 2);
      canvas.composite(img, offsetX, offsetY);
      await canvas.writeAsync(filePath);
      console.log(`Successfully resized ${file} proportionally`);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
  
  console.log('All done!');
}

resizeImages().catch(err => console.error(err));
