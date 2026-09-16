const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Record video
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 800, height: 600 }
    }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // wait for render
    
    await page.getByPlaceholder('98765 43210').fill('9225087140');
    await page.waitForTimeout(1000);
    
    await page.getByText('Send OTP').click();
    await page.waitForTimeout(2000); // Wait for transition
    
    // Now at step 2, wait 2 seconds to show the 123456
    await page.waitForTimeout(2000);
    
    await page.getByText('Verify & Continue').click();
    
    // Wait for home screen
    await page.waitForTimeout(4000); 
    
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await context.close();
    await browser.close();
    
    // Move video to artifacts folder
    const files = fs.readdirSync('videos');
    if (files.length > 0) {
      const vid = files[0];
      const targetPath = 'C:\\Users\\brand\\.gemini\\antigravity\\brain\\d374b48c-5284-4118-b656-490fedbea613\\login_demo.webm';
      fs.copyFileSync(path.join('videos', vid), targetPath);
      console.log('Video saved to:', targetPath);
    }
  }
})();
