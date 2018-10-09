# Instagram bot - LikeBomb ❤️ 💣

## Instagram bot to like all posts of a given user

[![PPTR badge](https://img.shields.io/badge/powered%20by-puppeteer-46aef7.svg)](https://pptr.dev) [![Node badge](https://img.shields.io/badge/node-10.6.0-brightgreen.svg)](https://nodejs.org/en/)

## Steps to use the bot

1. Download Node.js >= 10.6.0 and install it
2. Git clone or Download zip
3. Run `npm install` inside Insta-LikeBomb folder
4. Rename `.env_temp` to `.env`
5. Write your credentials in `INSTA_USERNAME` (without @ symbol) and `INSTA_PASSWORD`
6. Write your friend's Instagram username (without @ symbol) to like all his/her posts
7. Run `npm run start` to start the bot

### Tips: hide browser

Replace puppeteer browser option to this:

```javascript
const browser = await puppeteer.launch({
    headless: true
});
```

## LICENSE


The MIT License (MIT)

Copyright (c) 2018 Suresh Murali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
