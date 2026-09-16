const Jimp = require('jimp');
const fs = require('fs');

async function convert(file) {
  try {
    console.log(`Converting ${file}...`);
    const image = await Jimp.read(file);
    await image.writeAsync(file);
    console.log(`Successfully converted ${file} to true PNG.`);
  } catch (err) {
    console.error(`Error converting ${file}:`, err);
  }
}

async function main() {
  const dir = './assets';
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      await convert(`${dir}/${file}`);
    }
  }
}

main();
