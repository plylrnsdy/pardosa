# Pardosa

[![npm](https://img.shields.io/npm/v/pardosa.svg)](https://npmjs.org/package/pardosa)

A spider framework has a [Koa][koa] like APIs, written by Typescript.


## Feature

- [Koa][koa] like APIs, can configurate page processing with middlewares.
- Support schedule request, based on [node-schedule][node-schedule].
- Build-in middlewares:
  - `guard`: Print the request and it's processing time.
  - `fetch`: Use [node-fetch][node-fetch] request page.
    - `ctx.res`: [node-fetch][node-fetch]'s Response.
    - `ctx.response`: Pardosa's Response
      - exposes 3 interfaces of [xSelector][xselector]: `.css()`, `.xpath()`, `.re()`;
      - `.$`: Equivalent to `Cheerio.load(ctx.response.body)`.
  - `Router`: [Koa Router][koa-router] like APIs.
  - `schema`: Use XPath extract data to `ctx.state`.
  - `storage`
    - `file()`: Use after `fetch` and before `router`.
      - If `ctx.req.file` exist, save `ctx.response.body` to path `ctx.req.file`.
      - If `ctx.state.files` exist, save every `ctx.state.files[].content` into `ctx.state.files[].file`.
  - `inspect`: Print field of `ctx` by JSON Path, like `state.file`.


## Useage

```javascript
import * as Pardosa from "pardosa";
import * as fetch from "pardosa/middlewares/fetch";

const spider = new Pardosa({ exitOnIdle: true })
    .use(fetch())
    .use(async function (ctx, next) {
        console.log(ctx.response.xpath('//article').html());
    });

spider.source.enqueue('https://github.com/plylrnsdy/pardosa');
spider.start();
```

More [examples](https://github.com/plylrnsdy/pardosa/tree/master/src/examples).


## Install

    npm i -P pardosa

If you make a spider using Pardosa with **Typescript**, install with these declarations dependencies:

    npm i -D @types/node-schedule @types/node-fetch @types/cheerio


## Contribution

Submit the [issues][issues] if you find any bug or have any suggestion.

Or fork the [repo][repository] and submit pull requests.


## About

Author：plylrnsdy

Github：[pardosa][repository]


[repository]:https://github.com/plylrnsdy/pardosa
[issues]:https://github.com/plylrnsdy/pardosa/issues

[koa]:https://github.com/koajs/koa
[koa-router]:https://github.com/alexmingoia/koa-router
[node-fetch]:https://github.com/bitinn/node-fetch
[node-schedule]:https://github.com/node-schedule/node-schedule
[xselector]:https://github.com/plylrnsdy/xselector
