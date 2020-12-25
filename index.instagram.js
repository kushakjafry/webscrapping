const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
      headless:false
  });
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // page.on('request',(request) => {
  //     if(['stylesheet','image','font'].includes(request.resourceType())){
  //         request.abort();
  //     }else{
  //         request.continue();
  //     }
  // })
   await page.goto('https://instagram.com');
//   debugger;
  await page.waitFor(500);
  await page.waitFor('input[name="username"]');
  await page.type('input[name="username"]','kushakjafry',{delay:100});
  await page.type('input[name="password"]','kushak123',{delay:100});
  await page.click('#loginForm > div > div:nth-child(3) > button');
  await page.waitFor('#react-root > section > main > div > div > div > div > button');
  await page.click('#react-root > section > main > div > div > div > div > button');
  debugger;
 
//   await browser.close();
})()
