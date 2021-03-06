import * as compose from './compose';
import sleep from './utils/sleep';
import Source, { ISourceContext } from './utils/source';
import { EventEmitter } from 'events';


declare module Pardosa {

    export interface IOptions {
        saveOnExit?: boolean
        exitOnIdle?: boolean
        exitOnError?: boolean
    }

    export type Middleware<StateT, CustomT> = compose.Middleware<ParameterizedContext<StateT, CustomT>>;

    export interface BaseContext extends Record<string, any> {
        /**
         * The instance of Pardosa.
         * @deprecated Use `ctx.app` instead.
         */
        // TODO: remove in v1.0
        crawler: Pardosa<any, any>;

        /**
         * The instance of Pardosa.
         * @since 0.3.0
         */
        app: Pardosa<any, any>;

        /**
         * Requests queue. Enqueue request(s) for fetch more pages.
         */
        source: Source;
    }
    export type ParameterizedContext<StateT, CustomT> = BaseContext & { state: StateT } & CustomT;
}


const DEFAULT_OPTIONS: Pardosa.IOptions = {
    saveOnExit: true,
    exitOnIdle: false,
    exitOnError: false,
}

class Pardosa<S = Record<string, any>, C = Pardosa.BaseContext & ISourceContext> extends EventEmitter {

    /**
     * Statistics data of Pardosa.
     * @since 0.2.1
     */
    private _stat = {
        start: 0,
        lastestStart: 0,
        exit: 0,
        runtime: 0,

        request: 0,
        completed: 0,
        error: 0,
    };

    /**
     * Get statistics data of Pardosa.
     * @since 0.2.1
     */
    get stat() {
        return Object.assign({}, this._stat);
    }

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
        app: this,
        source: this.source,
    };

    private _middlewares: Pardosa.Middleware<S, C>[] = [
        catchError(),
        this.source.request() as any,
    ];


    constructor(options: Pardosa.IOptions = {}) {
        super();
        if (!(this instanceof Pardosa)) return new Pardosa();

        this._options = Object.assign({}, DEFAULT_OPTIONS, options);

        this.on('start', () => {
            this._stat.lastestStart = Date.now();
            this._stat.start || (this._stat.start = this._stat.lastestStart);
        });
        this.on('exit', () => {
            this._stat.exit = Date.now();
            this._stat.runtime += this._stat.exit - this._stat.lastestStart;
        });
        this.on('request', () => this._stat.request++);
        this.on('completed', () => this._stat.completed++);
        this.on('error', err => {
            console.log(err);
            this._stat.error++;
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
        this.emit('start');

        const composed = compose(this._middlewares);
        const { exitOnIdle } = this._options;

        let ctx;
        while (this.active) {
            if (this.source.isEmpty()) {
                if (exitOnIdle) {
                    this.stop();
                    continue;
                }
                await sleep(1000);
                continue;
            }

            this.emit('request');
            ctx = Object.create(this.context);
            ctx.state = {};
            await composed(ctx);
            this.emit('completed');
        }
        this.running = false;
    }

    /**
     * Stop the spider after fetched current page.
     */
    stop() {
        this._active = false;
        this.emit('exit');
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
            ctx.app.emit('error', error);
        }
    }
}
