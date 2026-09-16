const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.getByPlaceholder('98765 43210').fill('9225087140');
    await page.getByText('Send OTP').click();
    await page.waitForTimeout(3000);
    
    // Look for anything colored #ef4444
    const errs = await page.evaluate(() => {
      const els = document.querySelectorAll('*');
      const res = [];
      for(let el of els) {
        if(window.getComputedStyle(el).color === 'rgb(239, 68, 68)') {
           if(el.innerText && el.innerText.trim()) res.push(el.innerText);
        }
      }
      return res;
    });
    console.log('Detected error texts:', errs);
    
    if (errs.length === 0) {
      console.log('No error. Current text on page:');
      console.log(await page.locator('body').innerText());
    }
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await browser.close();
  }
})();
