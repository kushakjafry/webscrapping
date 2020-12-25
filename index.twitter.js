const puppeteer = require('puppeteer');
const twitter = require('./twitter');
const USERNAME = 'testcoding1';
const PASSWORD = 'kushak123';
(async () => {
    // const browser = await puppeteer.launch({
    //     headless:false
    // }); 
    // const page = await browser.newPage();
    await twitter.initialize();
    await twitter.login(USERNAME,PASSWORD);
    let details = await twitter.userDetails('udemy');
    // await twitter.postTweet('hi there next tweet')
    debugger;

})();