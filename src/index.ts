import * as compose from './compose';
import sleep from './utils/sleep';
import Source from './utils/source';
import { EventEmitter } from 'events';


declare module Pardosa {

    export interface IOptions {
        saveOnExit?: boolean
        exitOnIdle?: boolean
        exitOnError?: boolean
    }

    export type Middleware<StateT, CustomT> = compose.Middleware<ParameterizedContext<StateT, CustomT>>;

    export interface BaseContext extends Record<string, any> {
        crawler: Pardosa<any, any>;
        source: Source;
    }
    export type ParameterizedContext<StateT, CustomT> = BaseContext & {
        req: IRequest;
        url: string;
        state: StateT;
    } & CustomT;

    export type IRequest = string | {
        url: string;
        [key: string]: any;
    }
}


const DEFAULT_OPTIONS: Pardosa.IOptions = {
    saveOnExit: true,
    exitOnIdle: false,
    exitOnError: false,
}

class Pardosa<S = Record<string, any>, C = Pardosa.BaseContext> extends EventEmitter {

    private _active = true;
    /**
     * Not stop by user.
     */
    get active() { return this._active; }
    /**
     * Requesting url in queue.
     */
    running = false;

    private _options!: Pardosa.IOptions;

    /**
     * Requests queue. Enqueue request(s) for fetch more pages.
     */
    source: Source = new Source();

    /**
     * Context `ctx` prototype.
     */
    context: Pardosa.BaseContext = {
        crawler: this,
        source: this.source,
    };

    private _middlewares: Pardosa.Middleware<S, C>[] = [catchError()];


    constructor(options: Pardosa.IOptions = {}) {
        super();
        if (!(this instanceof Pardosa)) return new Pardosa();

        this._options = Object.assign(options, DEFAULT_OPTIONS);

        this.on('error', err => {
            console.log(err);
            this._options.exitOnError && this.stop();
        });
    }

    /**
     * Use the middleware to configurate fetching process.
     */
    use<T, U>(middleware: Pardosa.Middleware<S & T, C & U>): Pardosa<S & T, C & U> {
        if (typeof middleware !== 'function') {
            throw new TypeError('Middleware must be a function!');
        }
        this._middlewares.push(middleware as any);
        return this;
    }

    /**
     * Start the spider to fetch pages.
     */
    async start() {
        if (this.running) return;
        this.running = true;

        const composed = compose(this._middlewares);
        const exitOnIdle = this._options;

        let req, ctx;
        while (this.active) {
            req = this.source.dequeue();
            if (req == null) {
                if (exitOnIdle) {
                    this.stop();
                    continue;
                }
                await sleep(1000);
                continue;
            }

            ctx = Object.create(this.context)
            await composed(Object.assign(ctx, {
                req,
                url: typeof req === 'string' ? req : req.url,
                state: {},
            }));
        }
        this.running = false;
    }

    /**
     * Stop the spider after fetched current page.
     */
    stop() {
        this._active = false;
    }

    toJSON() {
        return this.source.toJSON();
    }
}

export = Pardosa;

function catchError<S, C>(): Pardosa.Middleware<S, C> {
    return async function catchError(ctx, next) {
        try {
            await next();
        } catch (error) {
            ctx.crawler.emit('error', error);
        }
    }
}
