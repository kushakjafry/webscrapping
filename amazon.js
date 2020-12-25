const puppeteer = require('puppeteer');

let browser = null;
let page = null;
const BASE_URL = 'https://www.amazon.com/';

const amazon = {
    
    initialize: async() => {

        console.log('starting scrapper')

        browser = await puppeteer.launch({
            headless: false
        })

        page = await browser.newPage();

        await page.goto(BASE_URL);
        console.log('initialization complete')

    },

    end: async() => {
        console.log('Stopping scrapper service');
        await browser.close();
    }

}

module.exports = amazon;