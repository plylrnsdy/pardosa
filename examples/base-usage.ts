import * as Pardosa from "../src";
import * as guard from '../src/middlewares/guard';
import * as fetch from "../src/middlewares/fetch";
import * as inspect from "../src/middlewares/inspect";
import * as storage from '../src/middlewares/storage';
import TurndownService = require('turndown');
// @ts-ignore
import turndownPluginGfm = require('turndown-plugin-gfm');


const turndownService = new TurndownService();
turndownService.use(turndownPluginGfm.gfm);

const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(async function ({ url, response, state }, next) {
        state.files = [{
            file: `output/${url.replace(/https?:\/\//, '')}/README.md`,
            content: turndownService.turndown(response.xpath('//article').html()),
        }];

        await next();
    })
    .use(inspect('state'))
    .use(storage.file());

spider.source.enqueue('https://github.com/plylrnsdy/pardosa');
spider.start();
