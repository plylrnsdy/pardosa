import * as Pardosa from "..";
import * as guard from '../middlewares/guard';
import * as fetch from "../middlewares/fetch";
import * as Router from "../middlewares/router";
import * as storage from "../middlewares/storage";
import { IFetchContext } from "../middlewares/fetch";
import { IFileContext } from "../middlewares/storage";
import { ISourceContext } from "../utils/source";


const url = 'http://nodejs.cn/api';

const router = new Router()
    .prefix('http://nodejs.cn')

    .use(new Router()
        .prefix('/api')

        .route<{}, ISourceContext & IFetchContext>(
            '/', async function (ctx, next) {
                const { source, url, response } = ctx;

                const links = response.xpath('//div[@id="column2"]/ul[1]//a').attrs('href');
                console.log(links);

                source.enqueue(...links.map(link => `${url}/${link}`));
            })
        .route<{}, IFileContext>(
            '/:module([^.]+).html', async function (ctx, next) {
                const { state, response, router: { params } } = ctx;

                state.file = `output/nodejs/${params.module}.html`;
                state.content = `
                    <!DOCTYPE html>
                    <html lang="zh-cn">
                    <head>
                        <title>${response.css('title').text()}</title>
                    </head>
                    <body>
                        ${response.css('#apicontent').html()}
                    </body>
                    </html>`;
            })
        .routes());

const spider = new Pardosa({ exitOnIdle: true, exitOnError: true })
    .use(guard())
    .use(fetch())
    .use(router.routes())
    .use(storage.file());

spider.source.enqueue(url);
spider.start();
