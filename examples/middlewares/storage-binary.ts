import * as Pardosa from "../../src";
import * as guard from '../../src/middlewares/guard';
import * as fetch from "../../src/middlewares/fetch";
import * as storage from '../../src/middlewares/storage';


const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(storage.file());

spider.source.enqueue({
    url: 'https://raw.githubusercontent.com/plylrnsdy/vscode-run-as/master/images/run-in-inner-terminal.gif',
    state: {
        file: 'output/github.com/plylrnsdy/vscode-run-as/run-in-inner-terminal.gif',
    },
});
spider.start();
