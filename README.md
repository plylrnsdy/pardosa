# Pardosa

[![npm](https://img.shields.io/npm/v/pardosa.svg)](https://npmjs.org/package/pardosa)

A spider framework has a Koa like APIs, written by Typescript.


## Feature

- Koa like APIs, can configurate page processing with middlewares.
- Support schedule request.
- Build-in middlewares:
  - `guard`: Print the request and it's processing time.
  - `fetch`: Use [node-fetch](https://github.com/bitinn/node-fetch) request page.
  - `Router`: Koa Router like APIs.
  - `schema`: Use XPath extract data to `ctx.state`.
  - `storage`
    - `file()`: If `ctx.type` is "file", save `ctx.content` into `ctx.file`.


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

If you make a spider using Pardosa with Typescript, install with these declarations dependencies:

    npm i -D @types/node-fetch @types/node-schedule


## Contribution

Submit the [issues][issues] if you find any bug or have any suggestion.

Or fork the [repo][repository] and submit pull requests.


## About

Author：plylrnsdy

Github：[pardosa][repository]


[issues]:https://github.com/plylrnsdy/pardosa/issues
[repository]:https://github.com/plylrnsdy/pardosa
