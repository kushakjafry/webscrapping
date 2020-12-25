const requestPromise = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const URLS = ['https://www.imdb.com/title/tt0102926/?ref_=fn_al_tt_2','https://www.imdb.com/title/tt2267998/'];
// const { Parser } = require('json2csv');

(async () => {
    let moviesData = [];
    for(movie of URLS){
        let errMess = false;
        console.log(`scraping ${movie}`);
        const response = await requestPromise({
            uri: movie,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                'referer': 'https://www.imdb.com/find?q=silence+of+the+lamb&ref_=nv_sr_sm',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests':'1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59'
            },
            resolveWithFullResponse:true,
            gzip:true
        }).catch(error => {
            debugger;
            errMess = true;
            console.log(`error ${error}`); 
        })
        if(errMess){
            debugger;
            continue
        }
        debugger;
        let $ = cheerio.load(response);
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('div[class="ratingValue"] > strong > span').text();
        let poster = $('div[class="poster"] > a > img').attr('src');
        let totalRatings = $('div[class="imdbRating"] > a').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();
        let genres = [];
        $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i,elem) => {
            let genre = $(elem).text();
            genres.push(genre);
        })
        console.log(`scraping of ${title} done`);

        moviesData.push({
            title,
            rating,
            poster,
            totalRatings,
            releaseDate,
            genres
        })

        let file = fs.createWriteStream(`${title}.jpg`)

        await new Promise((resolve,reject) => {
            let stream = request({
                uri:poster,
                headers:{
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'max-age=0',
                    'referer': 'https://www.imdb.com/find?q=silence+of+the+lamb&ref_=nv_sr_sm',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests':'1',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59' 
                },
                gzip:true
            })
            .pipe(file)
            .on('finish',() => {
                console.log(`${title} completed downloading the image`);
                resolve();
            })
            .on('error',(error) => {
                reject(error);
            })
        }).catch((error) => {
            console.log(`${title} error in dowloading file ${error}`);
        })
        
    }

    console.log('scrapping complete');

    // const json2csvParser = new Parser();
    // const csv = json2csvParser.parse(moviesData);
    // console.log(csv)
    // fs.writeFileSync('./data.csv',csv,'utf8');
})()

