import * as Pardosa from "../../src";
import * as Router from "../../src/middlewares/router";
import * as cleanStack from "../../src/middlewares/clean-stack";


const spider = new Pardosa({ exitOnError: true })
    .use(cleanStack())
    .use(new Router()
        .prefix('https://httpbin.org')
        .use(new Router()
            .prefix('/html')
            .route('/', async () => goWrong())
            .routes())
        .routes())

spider.source.enqueue('https://httpbin.org/html');
spider.start();

function goWrong() {
    throw new Error('Something wrong!');
}
