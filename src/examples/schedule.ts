import * as Pardosa from "..";
import * as fetch from "../middlewares/fetch";


const spider = new Pardosa()
    .use(fetch())
    .use(async function ({ response }, next) {
        let title = response.xpath('//h1').text();
        console.log(Date.now(), title);
    });

spider.source
    // in every minute's no.0 second to fetch the page
    .schedule('0 * * * * *', 'https://httpbin.org/html');

spider.start();
