import { Middleware } from '.';


declare module compose {
    export type Middleware<T> = (context: T, next: () => Promise<any>) => any;
    export type ComposedMiddleware<T> = (context: T, next?: () => Promise<any>) => Promise<void>;
}


async function noop() { }

/**
 * Compose middlewares.
 *
 * @param middlewares a middleware queue
 */
function compose<StateT, CustomT>(middlewares: Middleware<StateT, CustomT>[]) {

    /**
     * Composed middleware.
     *
     * @param ctx a context of one fetching
     * @param next high level next middleware
     * @param i executing middleware index in queue
     */
    return async function composed(ctx: any, next?: () => Promise<void>, i: number = 0): Promise<void> {
        try {
            const _next = i + 1 < middlewares.length
                ? composed.bind(null, ctx, void 0, i + 1)
                : noop;

            await middlewares[i](ctx, _next);

            next && await next();

        } catch (error) {
            ctx.crawler.emit('error', error);
        }
    }
}

export = compose;
