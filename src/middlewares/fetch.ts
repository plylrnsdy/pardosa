import * as cheerio from 'cheerio';
import * as xselector from 'xselector';
import * as mime from 'mime';
import nodeFetch, { Request } from 'node-fetch';
import { Middleware } from '..';
import { Response as FetchResponse } from 'node-fetch';


declare namespace fetch {
    export interface IFetchContext {
        /**
         * `node-fetch`'s Response.
         */
        res: FetchResponse;
        /**
         * Pardosa's Response.
         */
        response: Response;
    }
}


class Response {

    /**
     * If `Content-Type` is `json`, it is a json object;\
     * if `Content-Type` is `text`, it is a string;\
     * else it is undefined, need to parse `ctx.res` by yourself.
     */
    body: string | Record<string, any> | undefined

    private _$: CheerioStatic | undefined

    /**
     * If `Content-Type` is `html`, it is a `CheerioStatic`;\
     * else it will be throw an TypeError.
     */
    get $() {
        if (this._$) {
            return this._$;
        }
        if (typeof this.body !== 'string' || !this.is('html')) {
            throw new TypeError('Response#body should be html.');
        }
        return this._$ = cheerio.load(this.body);
    }

    constructor(private res: FetchResponse) { }

    private async $init() {
        if (this.is('json')) {
            this.body = await this.res.json();
        } else if (this.is('text')) {
            this.body = await this.res.textConverted();
        }
    }

    /**
     * Return response header field.
     */
    get(field: string) {
        return this.res.headers.get(field);
    }

    /**
     * Return response `Content-Type`.
     */
    get type() {
        const type = this.get('Content-Type');
        return type ? type.split(';')[0] : '';
    }

    /**
     * Judge response `Content-Type` contains type.
     */
    is(type: string) {
        return this.type.includes(type.toLowerCase());
    }

    /**
     * Return extension for mime type of the response `Content-Type`.
     */
    get extension() {
        return mime.getExtension(this.type);
    }

    /**
     * Use CSS Selector search in Response#`body`.
     *
     * If Response#`body` type is not html, it will throw a TypeError.
     */
    css(selector: string) {
        if (!this.is('html')) throw new TypeError('Response#css() need Response#body to be html.');
        return xselector.load(this.body as string).css(selector);
    }

    /**
     * Use XPath search in Response#`body`.
     *
     * If Response#`body` type is not html, it will throw a TypeError.
     */
    xpath(xpath: string) {
        if (!this.is('html')) throw new TypeError('Response#xpath() need Response#body to be html.');
        return xselector.load(this.body as string).xpath(xpath);
    }

    /**
     * Use RegExp search in Response#`body`.
     *
     * If Response#`body` type is not string, it will throw a TypeError.
     *
     * @param re
     * @param searchText If true AND Response#`body` type is html, only search in TextNode of html;
     *                   If false OR Response#`body` type is not html, search in all text.
     *                   Default is false.
     */
    re(re: string | RegExp, searchText: boolean = false) {
        if (typeof this.body !== 'string') throw new TypeError('Response#re() need Response#body to be string.');
        if (searchText && this.is('html')) {
            return xselector.load(this.body).regexps(re, searchText);
        }
        return this.body.match(re);
    }
}

/**
 * Fetch page use [node-fetch](https://github.com/bitinn/node-fetch).
 */
function fetch(): Middleware<{}, fetch.IFetchContext> {

    return async function (ctx, next) {

        ctx.res = typeof ctx.req === 'string' || ctx.req instanceof Request
            ? await nodeFetch(ctx.req)
            : await nodeFetch(ctx.req.url, ctx.req as any)

        ctx.response = new Response(ctx.res);

        await (<any>ctx.response).$init();
        await next();
    }
}


export = fetch;
