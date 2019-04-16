
import * as pathToRegexp from 'path-to-regexp';
import * as compose from '../compose';
import { Middleware, ParameterizedContext } from '..';


declare module Router {

    export interface IContext {
        router: {
            /**
             * Current relative path after processed by the front route.
             */
            url: string;
            /**
             * The params (such as `:name`) and it's value be defined in path.
             */
            params: Record<string, string>;
        }
    }
    export type IMiddleware<StateT, CustomT> =
        Middleware<StateT, CustomT & ParameterizedContext<StateT, CustomT>>
}


const prefixOptions = { end: false };

/**
 * A router for Pardosa, so that differnet url can use different middlewares to process page.
 */
class Router<S = Record<string, any>, C = Router.IContext> {

    private _prefix: Middleware<S, C> | undefined;
    private _middlewares: Middleware<S, C>[] = [];
    private _routes: Middleware<S, C>[][] = [];

    constructor() {
        if (!(this instanceof Router)) return new Router();
    }

    private _route(path: string, isPrefix: boolean): Middleware<{}, C> {
        const formattedPath = path.endsWith('/') ? path.slice(0, path.length - 1) : path;
        const params = [] as pathToRegexp.Key[];
        const options = isPrefix ? prefixOptions : void 0;
        const re = pathToRegexp(formattedPath, params, options);
        const paramKeys = params.map(key => key.name);

        return async function (ctx, next) {
            if (ctx.router == null) {
                ctx.router = {
                    url: ctx.url,
                    params: {},
                    query: {},
                };
            }
            const { router } = ctx;
            const { url, params } = router;

            let matches;
            if (matches = url.match(re)) {
                const [urlMatched, ...paramValues] = matches;

                for (const i in paramKeys) {
                    params[paramKeys[i]] = paramValues[i];
                }

                router.url = url.slice(urlMatched.length);

                await next();
            }
        }
    }

    /**
     * If request url match the prefix, then execute the middlewares in this router;
     * else skip this router.
     */
    prefix(path: string): this {
        this._prefix = this._route(path, true)
        return this;
    }

    /**
     * Use the middleware to configurate fetching process,
     * before execute the middlewares used in Router#`route()`.
     */
    use<T, U>(middleware: Middleware<S & T, C & U>): Router<S & T, C & U> {

        this._middlewares.push(middleware as any);
        return this;
    }

    /**
     * If request url match the path, then execute the middlewares in this route;
     * else skip this route.
     */
    route<T, U>(path: string, ...middlewares: Array<Middleware<S & T, C & U>>): Router<S & T, C & U> {

        this._routes.push([this._route(path, false), ...middlewares as any]);
        return this;
    }

    /**
     * Return a composed middleware for Pardosa to use.
     */
    routes(): Middleware<S, C> {
        const middlewares = [] as Middleware<S, C>[];

        if (this._prefix) {
            middlewares.push(this._prefix as any);
        }
        if (this._middlewares.length) {
            middlewares.push(...this._middlewares as any[]);
        }

        if (this._routes.length) {
            middlewares.push(
                compose(this._routes.map(route => compose(route as any)))
            );
        }

        return compose(middlewares as any);
    }
}

export = Router;
