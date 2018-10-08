const puppeteer = require('puppeteer'); // Helps to cast magic on browser
require('dotenv').config(); // Helps to load secret env file

// Fetch creds and victim ID
const {
  INSTA_USERNAME,
  INSTA_PASSWORD,
  INSTA_LIKEBOMB_VICTIM_ID,
} = process.env;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1280,1000'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  // Go to Insta login page
  await page.goto('https://instagram.com/accounts/login');

  // Check if atleast one input tag is loaded
  await page.waitFor(() => document.querySelectorAll('input').length);

  // Automagically type creds and login
  await page.type('[name=username]', INSTA_USERNAME);
  await page.type('[name=password]', INSTA_PASSWORD);
  await page.evaluate(() => {
    document.querySelector('.oF4XW').click();
  });
  await page.waitForNavigation();

  // Go to victim page
  await page.goto(`https://www.instagram.com/${INSTA_LIKEBOMB_VICTIM_ID}/`);

  // Debug logs
  page.on('console', consoleObj => console.log(consoleObj._text));

  // Open first post
  await page.evaluate(() => {
    const posts = document.getElementsByClassName('eLAPa');
    posts[0].click();
  });
  // Wait for first post modal to load
  await page.waitForSelector('button.ckWGn');
  let i = 1;
  let nextPostAvailable = true;
  do {
    // Check if photo already liked
    console.log('Check if photo already liked');
    let photoLiked = await page.evaluate(() => {
      const likeStatus = (document.querySelector('button.coreSpriteHeartOpen span').getAttribute('aria-label') === 'Like');
      if (likeStatus) {
        document.querySelector('button.coreSpriteHeartOpen').click();
        return true;
      }
      return false;
    });
    if (photoLiked) {
      console.log(`Post ${i}: Liked`);
    } else {
      console.log(`Post ${i}: already liked`);
    }
    i += 1;

    let nextPostLink = '';
    await page.evaluate(() => {
      if (document.querySelector('a.coreSpriteRightPaginationArrow')) {
        nextPostLink = document.querySelector('a.coreSpriteRightPaginationArrow').getAttribute('href');
        document.querySelector('a.coreSpriteRightPaginationArrow').click();
      }
    });
    console.log('nextPostLink: ', nextPostLink);
    console.log('Fetched next post link & Clicked next button');

    console.log('Wait for render');
    try {
      await page.waitFor(() => (
        nextPostLink !== document.querySelector('a.coreSpriteRightPaginationArrow').getAttribute('href')
      ));
      console.log('Render completed');
    } catch (error) {
      nextPostAvailable = false;
      photoLiked = await page.evaluate(() => {
        const likeStatus = (document.querySelector('button.coreSpriteHeartOpen span').getAttribute('aria-label') === 'Like');
        if (likeStatus) {
          document.querySelector('button.coreSpriteHeartOpen').click();
          return true;
        }
        return false;
      });
      if (photoLiked) {
        console.log(`Post ${i}: Liked`);
      } else {
        console.log(`Post ${i}: already liked`);
      }
      console.log('Finish');
      await browser.close();
    }
  } while (nextPostAvailable);
})();
