const puppeteer = require('puppeteer');
require('dotenv').config();

const { INSTA_USERNAME, INSTA_PASSWORD } = process.env;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=1920,1080',
    ],
    slowMo: 10,
  });
  const page = await browser.newPage();
  page.setViewport({ height: 1080, width: 1920 });
  await page.goto('https://instagram.com/accounts/login');
  await page.waitFor(() => document.querySelectorAll('input').length);
  await page.type('[name=username]', INSTA_USERNAME);
  await page.type('[name=password]', INSTA_PASSWORD);
  await browser.close();
})();
