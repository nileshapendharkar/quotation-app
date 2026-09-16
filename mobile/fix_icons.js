const Jimp = require('jimp');
const path = require('path');

async function makeSquare(inputPath, outputPath, targetSize) {
  const image = await Jimp.read(inputPath);
  const w = image.getWidth();
  const h = image.getHeight();
  const max = Math.max(w, h);
  
  // Create a square white canvas
  const canvas = new Jimp(max, max, 0xFFFFFFFF);
  
  // Center the original image on the canvas
  const x = Math.floor((max - w) / 2);
  const y = Math.floor((max - h) / 2);
  canvas.composite(image, x, y);
  
  // Resize to target if specified
  if (targetSize) {
    canvas.resize(targetSize, targetSize);
  }
  
  await canvas.writeAsync(outputPath);
  console.log(`Created ${outputPath} (${canvas.getWidth()}x${canvas.getHeight()})`);
}

async function main() {
  const assetsDir = path.join(__dirname, 'assets');
  
  // Fix icon.png - needs to be 1024x1024 square
  await makeSquare(
    path.join(assetsDir, 'icon.png'),
    path.join(assetsDir, 'icon.png'),
    1024
  );
  
  // Fix adaptive-icon.png - needs to be 1024x1024 square
  await makeSquare(
    path.join(assetsDir, 'adaptive-icon.png'),
    path.join(assetsDir, 'adaptive-icon.png'),
    1024
  );
  
  // Fix favicon.png - needs to be square (48x48 for favicon)
  await makeSquare(
    path.join(assetsDir, 'favicon.png'),
    path.join(assetsDir, 'favicon.png'),
    48
  );
  
  // Fix splash.png - needs to be square for splash screen
  await makeSquare(
    path.join(assetsDir, 'splash.png'),
    path.join(assetsDir, 'splash.png'),
    1024
  );
  
  // Fix splash_logo.png - needs to be square
  await makeSquare(
    path.join(assetsDir, 'splash_logo.png'),
    path.join(assetsDir, 'splash_logo.png'),
    512
  );
  
  console.log('\nAll icons fixed to square dimensions!');
}

main().catch(console.error);
