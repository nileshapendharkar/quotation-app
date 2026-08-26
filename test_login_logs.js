const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.getByPlaceholder('98765 43210').fill('9255087140'); // The user specifically said 9255087140
    await page.getByText('Send OTP').click();
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await browser.close();
  }
})();
