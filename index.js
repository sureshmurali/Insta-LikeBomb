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
    slowMo: 0,
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
  for (let i = 0; i < 6; i += 1) {
    // Check if photo already liked
    console.log('Check if photo already liked');
    const photoLiked = await page.evaluate(() => {
      const likeStatus = (document.querySelector('button.coreSpriteHeartOpen span').getAttribute('aria-label') === 'Like');
      if (likeStatus) {
        document.querySelector('button.coreSpriteHeartOpen').click();
        return true;
      }
      return false;
    });
    if (photoLiked) {
      console.log(`Post ${i + 1}: Liked`);
    } else {
      console.log(`Post ${i + 1}: already liked`);
    }

    // Get current photo link to make sure it gets replaced with new one
    console.log('Starting to scrape media link');
    let mediaLink = '';
    await page.evaluate(() => {
      if (document.querySelector('article.M9sTE img.FFVAD')) {
        mediaLink = document.querySelector('article.M9sTE img.FFVAD').getAttribute('srcset');
      } else if (document.querySelector('article.M9sTE video.tWeCl')) {
        mediaLink = document.querySelector('article.M9sTE video.tWeCl').getAttribute('src');
      } else {
        console.log('ERROR: Photo/Video not found after like press');
      }
    });
    console.log('Media link fetched successfully');

    // Check if next post arrow nav button available
    console.log('Check if next post arrow nav button available');
    const nextPostAvailable = await page.evaluate(() => !!(document.querySelector('a.coreSpriteRightPaginationArrow')));
    if (nextPostAvailable) {
      // Render next post by clicking arrow nav button
      await page.evaluate(() => {
        document.querySelector('a.coreSpriteRightPaginationArrow').click();
      });
      //  Wait for render
      try {
        await page.waitFor(() => (
          mediaLink !== document.querySelector('article.M9sTE img.FFVAD').getAttribute('srcset')
        ));
      } catch (error) {
        await page.waitFor(() => (
          (mediaLink !== document.querySelector('article.M9sTE video.tWeCl').getAttribute('src'))
        ));
      }
    } else {
      console.log('Finish');
      await browser.close();
    }
  }
})();
