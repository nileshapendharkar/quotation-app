const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    // Only print my manual BROWSER LOGs to keep output small
    if(msg.text().includes('BROWSER LOG:')) {
      console.log(msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.getByPlaceholder('98765 43210').fill('9225087140');
    await page.getByText('Send OTP').click();
    await page.waitForTimeout(4000);
    
    const errBoxes = await page.locator('text=Account not found').count();
    const otherErr = await page.locator('text=SMS Delivery Failed').count();
    
    console.log('Error boxes found:', errBoxes, otherErr);
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await browser.close();
  }
})();
