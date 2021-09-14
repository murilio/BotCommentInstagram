require('dotenv').config()
const puppeteer = require('puppeteer');

const username = process.env.INSTA_USERNAME
const password = process.env.INSTA_PASSWORD
const postURL = process.env.INSTA_POST_URL
const comment = process.env.INSTA_COMMENT;
const comment_time = process.env.INSTA_COMMENT_TIME;

(async () => {
  // Starting browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Login flow
  await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Waiting for page to refresh
  await page.waitForNavigation();

  // Navigate to post and submitting the comment
  await page.goto(postURL);

  // Promise time comment
  await new Promise((resolve) => {
    var time = setInterval(async () => {
      await page.waitForSelector('textarea');
      await page.type('textarea', comment);
      await page.click('button[type="submit"]');
      resolve()
    }, comment_time)
  })

  // await browser.close();
})();
