const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    
    // Type phone number
    await page.getByPlaceholder('98765 43210').fill('9225087140');
    
    // Click Send OTP
    await page.getByText('Send OTP').click();
    
    // Wait a bit to see if error shows up or transitions to step 2
    await page.waitForTimeout(3000);
    
    // Check for error text
    const errorLoc = page.locator('text=Account not found').or(page.locator('text=SMS Delivery Failed'));
    if (await errorLoc.count() > 0) {
      console.log('Error found on screen:', await errorLoc.first().innerText());
    } else {
      console.log('No error found. Trying to verify Step 2...');
      
      const otpText = page.locator('text=OTP Send to');
      if (await otpText.count() > 0) {
        console.log('Successfully transitioned to Step 2!');
        // Type OTP 123456
        const inputs = page.locator('input[placeholder="0"]');
        if (await inputs.count() === 6) {
          for(let i=0; i<6; i++) {
            await inputs.nth(i).fill((i+1).toString());
          }
          await page.getByText('Verify & Continue').click();
          await page.waitForTimeout(3000);
          
          // Check if Home Screen is reached
          const home = page.locator('text=Home');
          if (await home.count() > 0) {
             console.log('Successfully reached Home Screen!');
          } else {
             console.log('Failed to reach Home Screen after clicking Verify & Continue.');
          }
        } else {
           console.log('OTP inputs not found!');
        }
      } else {
        console.log('Did NOT transition to Step 2. Stays on Step 1?');
      }
    }
  } catch (err) {
    console.error('Script Error:', err);
  } finally {
    await browser.close();
  }
})();
