import * as Pardosa from "..";
import * as guard from '../middlewares/guard';
import * as fetch from "../middlewares/fetch";
import * as storage from '../middlewares/storage';


const spider = new Pardosa({ exitOnIdle: true })
    .use(guard())
    .use(fetch())
    .use(storage.file());

spider.source.enqueue({
    url: 'https://raw.githubusercontent.com/plylrnsdy/vscode-run-as/master/images/run-in-inner-terminal.gif',
    file: 'output/github.com/plylrnsdy/vscode-run-as/run-in-inner-terminal.gif'
});
spider.start();
