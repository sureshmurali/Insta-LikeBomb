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
    slowMo: 3,
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
  page.on('console', consoleObj => console.log(consoleObj._text));
  await page.evaluate(() => {
    const posts = document.getElementsByClassName('eLAPa');
    console.log(`No. of posts scraped: ${posts.length}`);
    posts[0].click();
  });
  await page.waitForSelector('button.ckWGn');
  await page.evaluate(() => {
    const likeStatus = (document.querySelector('button.coreSpriteHeartOpen span').getAttribute('aria-label') === 'Like');
    if (likeStatus) {
      document.querySelector('button.coreSpriteHeartOpen').click();
    }
  });
  await page.waitFor(2000);
  await page.evaluate(() => {
    document.querySelector('button.ckWGn').click();
  });
  await page.waitFor(2000);
  await browser.close();
})();
