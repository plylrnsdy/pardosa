import { Middleware } from "..";
import get = require('lodash.get');


declare module inspect { }


function inspect(path: string): Middleware<{}, {}> {

    return function (ctx, next) {
        console.log(get(ctx, path));

        return next();
    }
}

export = inspect;
