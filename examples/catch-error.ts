import * as Pardosa from "../src";
import * as Router from "../src/middlewares/router";


const spider = new Pardosa({ exitOnError: true })
    .use(new Router()
        .prefix('https://httpbin.org')
        .use(new Router()
            .prefix('/html')
            .route('/', async () => goWrong(1))
            .routes())
        .routes())
    // should not execute
    .use(async () => goWrong(2));

spider.source.enqueue('https://httpbin.org/html');
spider.start();

function goWrong(num: number) {
    throw new Error(`${num} thing wrong!`);
}
