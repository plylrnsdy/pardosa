import * as Pardosa from "../src";
import * as guard from '../src/middlewares/guard';
import * as fetch from "../src/middlewares/fetch";
import * as Router from "../src/middlewares/router";
import * as storage from "../src/middlewares/storage";
import { IFetchContext } from "../src/middlewares/fetch";
import { IFileContext } from "../src/middlewares/storage";
import { ISourceContext } from "../src/utils/source";


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

                state.files = [{
                    file: `output/nodejs/${params.module}.html`,
                    content: `
                        <!DOCTYPE html>
                        <html lang="zh-cn">
                        <head>
                            <title>${response.css('title').text()}</title>
                        </head>
                        <body>
                            ${response.css('#apicontent').html()}
                        </body>
                        </html>`,
                }];
            })
        .routes());

const spider = new Pardosa({ exitOnIdle: true, exitOnError: true })
    .use(guard())
    .use(fetch())
    .use(router.routes())
    .use(storage.file());

spider.source.enqueue(url);
spider.start();
