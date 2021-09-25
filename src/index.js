require('dotenv').config()
const puppeteer = require('puppeteer');

const username = process.env.INSTA_USERNAME;
const password = process.env.INSTA_PASSWORD;
const postURL = process.env.INSTA_POST_URL;
const comment = process.env.INSTA_COMMENT;

// generate random time
const randomTime = () => {
  return (Math.floor(Math.random() * (900000 - 60000)) + 60000)
}

// const millisecondsToMinutesAndSeconds = milliseconds => {
//   var minutes = Math.floor(milliseconds / 60000);
//   var seconds = ((milliseconds % 60000) / 1000).toFixed(0);

//   console.log("Time comment :: " + minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
// }

// a normal delay function, you can call this with await
const delay = d => new Promise(r => setTimeout(r, d))

async function commentPost(page, i) {
  await delay(randomTime())

  await page.waitForSelector('textarea');
  await page.type('textarea', comment);
  await page.click('button[type="submit"]');

  console.log("Comment ::", i);

  return commentPost(page, i + 1)
}

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

  commentPost(page, 1).then()
  // await browser.close();
})();
