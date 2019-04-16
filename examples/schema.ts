import * as Pardosa from "..";
import * as fetch from "../middlewares/fetch";
import * as guard from '../middlewares/guard';
import * as schema from "../middlewares/schema";


const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(schema({
        project: '//a[contains(@data-pjax, "#js-repo-pjax-container")]/text()',
        author: '//a[contains(@class, "author")]/text()',
        attributes: {
            watching: 'normalize-space(//a[contains(@href, "watchers")]/text())',
            stars: 'normalize-space(//a[contains(@href, "stargazers")]/text())',
            forked: 'normalize-space(//a[contains(@href, "network/members")]/text())',
        }
    }))
    .use(async function ({ crawler, state }) {
        console.log(state)
        crawler.stop();
    })

spider.source.enqueue('https://github.com/plylrnsdy/kawlar');
spider.start();
