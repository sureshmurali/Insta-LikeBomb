const puppeteer = require('puppeteer');
require('dotenv').config();

const {
  INSTA_USERNAME,
  INSTA_PASSWORD,
  INSTA_LIKEBOMB_VICTIM_ID,
} = process.env;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1280,1000'],
    slowMo: 10,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://instagram.com/accounts/login');
  await page.waitFor(() => document.querySelectorAll('input').length);
  await page.type('[name=username]', INSTA_USERNAME);
  await page.type('[name=password]', INSTA_PASSWORD);
  await page.evaluate(() => {
    document.querySelector('.oF4XW').click();
  });
  await page.waitForNavigation();
  await page.goto(`https://www.instagram.com/${INSTA_LIKEBOMB_VICTIM_ID}/`);
  await page.waitFor(2000);
  await browser.close();
})();
