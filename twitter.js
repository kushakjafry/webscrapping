const puppeteer = require('puppeteer');
const BASEURL = 'https://twitter.com/home';
const LOGINURL = 'https://twitter.com/login';
const USERNAME_URL = ((username) => `https://twitter.com/${username}`);  

let browser = null;
let page = null;

const TWITTER = {
    
    initialize: async() => {
        browser = await puppeteer.launch({
            headless:false
        }); 
        page = await browser.newPage();

    },

    login: async(username,password) => {
        await page.goto(LOGINURL);
        await page.waitFor('input[name="session[username_or_email]');
        const usernameInput = await page.$$('input[name="session[username_or_email]"]');
        await usernameInput[0].type(username,{delay:100});
        const passwordInput = await page.$$('input[name="session[password]"]');
        await passwordInput[0].type(password,{delay:100});
        const submitButton = await page.$$('div[role="button"]');
        await submitButton[0].click({delay:100});
        await page.waitFor('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]');
        await page.waitFor(1000);
    },

    postTweet: async(message) => {
        const url = await page.url();
        if(url !== BASEURL){
            await page.goto(BASEURL)
        }
        await page.waitFor('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]')
        await page.click('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]');
        await page.waitFor(1000)
        await page.keyboard.type(message,{delay:100});
        await page.click('div[data-testid="tweetButtonInline"]');
    },

    userDetails: async(username) => {
        let url = await page.url();
        if(url !== USERNAME_URL(username)){
            await page.goto(USERNAME_URL(username));
        }  
        await page.waitFor('a[href*="/following"]')
        let details = await page.evaluate(() => {
            return {
                fullname: document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"]') ? document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"]').innerText : '',
                description: document.querySelector('div[data-testid="UserDescription"]') ? document.querySelector('div[data-testid="UserDescription"]').innerText : '',
                following: document.querySelector('a[href*="/following"]') ? document.querySelector('a[href*="/following"]').getAttribute('title') : '',
                followers: document.querySelector('a[href*="/followers"]') ? document.querySelector('a[href*="/followers"]').getAttribute('title') : '',
                tweets_count: document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"]')?document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"]').nextSibling? document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"]').nextSibling.innerText:'':'',
                date_of_joining: document.querySelector('div[data-testid="UserProfileHeader_Items"]') ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[2] ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[2].innerText: '': '',
                location: document.querySelector('div[data-testid="UserProfileHeader_Items"]') ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[0] ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[0].innerText : '' : '' ,
                link_to_page: document.querySelector('div[data-testid="UserProfileHeader_Items"]') ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[1] ? document.querySelector('div[data-testid="UserProfileHeader_Items"]').childNodes[1].getAttribute('href'):'':'',
                verified_account: document.querySelector('div[data-testid="primaryColumn"] h2[role="heading"] svg[aria-label="Verified account"]')? true : false
            }
        })
        return details;
    },

    end: async() => {
        await browser.close();
    }

}

module.exports = TWITTER;
