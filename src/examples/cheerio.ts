import * as Pardosa from "..";
import * as guard from '../middlewares/guard';
import * as fetch from "../middlewares/fetch";
import * as inspect from "../middlewares/inspect";


const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(async function ({ response: { $ }, state }, next) {

        Object.assign(state, {
            project: $('a[data-pjax~="#js-repo-pjax-container"]').text(),
            author: $('span.author').text(),
            attributes: {
                watching: ~~$('a[href*="watchers"]').text().trim(),
                stars: ~~$('a[href*="stargazers"]').text().trim(),
                forked: ~~$('a[href*="network/members"]').text().trim(),
            }
        });

        await next();
    })
    .use(inspect('state'));

spider.source.enqueue('https://github.com/plylrnsdy/pardosa');
spider.start();
