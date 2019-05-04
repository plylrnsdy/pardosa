import * as Pardosa from "../../src";
import * as fetch from "../../src/middlewares/fetch";
import * as guard from '../../src/middlewares/guard';
import * as schema from "../../src/middlewares/schema";
import * as inspect from "../../src/middlewares/inspect";


const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(schema({
        project: '//a[contains(@data-pjax, "#js-repo-pjax-container")]/text()',
        author: '//span[@class="author"]/a/text()',
        attributes: {
            watching: 'normalize-space(//a[contains(@href, "watchers")]/text())',
            stars: 'normalize-space(//a[contains(@href, "stargazers")]/text())',
            forked: 'normalize-space(//a[contains(@href, "network/members")]/text())',
        }
    }))
    .use(inspect('state'));

spider.source.enqueue('https://github.com/plylrnsdy/pardosa');
spider.start();
