const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.getByPlaceholder('98765 43210').fill('9225087140');
    await page.getByText('Send OTP').click();
    await page.waitForTimeout(3000);
    
    // Dump entire body HTML to see what is rendering
    const html = await page.innerHTML('body');
    fs.writeFileSync('dom.html', html);
    
    // also dump text
    const text = await page.innerText('body');
    fs.writeFileSync('dom.txt', text);
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await browser.close();
  }
})();
