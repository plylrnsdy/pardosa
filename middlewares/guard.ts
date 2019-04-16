import { Middleware } from '..';


/**
 * Print the request and it's processing time.
 *
 * Such as `GET http://example.com - 126ms`
 */
function guard(): Middleware<{}, {}> {

    return async function (ctx: any, next: () => Promise<void>) {
        const start = Date.now();
        const { req: { method = 'GET' }, url } = ctx;

        await next();

        console.info(`${method} ${url} ${ctx.res.status} - ${Date.now() - start}ms`);
    }
}

declare module guard { }

export = guard;
