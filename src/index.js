require('dotenv').config()
const puppeteer = require('puppeteer');

const username = process.env.INSTA_USERNAME;
const password = process.env.INSTA_PASSWORD;
const postURL = process.env.INSTA_POST_URL;
const comments = process.env.INSTA_COMMENT;

// criando um array com itens
const newComments = comments.split(',');

// generate random time
const randomTime = () => (Math.floor(Math.random() * (900000 - 60000)) + 60000)

// gera um index aleatório de acordo com o tamanho do array
const randomIndex = () => (Math.floor(Math.random() * newComments.length))

// a normal delay function, you can call this with await
const delay = time => new Promise(r => setTimeout(r, time))

async function commentPost(page, i) {
  await delay(randomTime())

  const comment = newComments[randomIndex()]
  await page.waitForSelector('textarea');
  await page.type('textarea', comment);
  await page.click('button[type="submit"]');

  console.log("Comment ::", i, comment);

  return commentPost(page, i + 1)
}

(async () => {
  // Starting browser
  const browser = await puppeteer.launch({ headless: true });
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
