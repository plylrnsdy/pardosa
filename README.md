# Pardosa

A spider framework has a Koa like APIs, written by Typescript.


## Feature

- Koa like APIs, can configurate page processing with middlewares.
- Support schedule request.
- Build-in middlewares:
  - `guard`, print the request and it's processing time.
  - `fetch`, use [node-fetch](https://github.com/bitinn/node-fetch) request page.
  - `Router`, Koa Router like APIs.
  - `schema`, use XPath extract data to `ctx.state`.
  - `storage`
    - .`file()`, save content into file.


## Useage

```javascript
import * as Pardosa from "pardosa";
import * as fetch from "pardosa/middlewares/fetch";

const spider = new Pardosa({ exitOnIdle: true })
    .use(fetch())
    .use(async function ({ url, response, state }, next) {
        console.log(response.xpath('//article').html())
    });

spider.source.enqueue('https://github.com/plylrnsdy/pardosa');
spider.start();
```

More [examples](https://github.com/plylrnsdy/pardosa/tree/master/examples).


## Install

    npm i -P pardosa


## Contribution

Submit the [issues][issues] if you find any bug or have any suggestion.

Or fork the [repo][repository] and submit pull requests.


## About

Author：plylrnsdy

Github：[pardosa][repository]


[issues]:https://github.com/plylrnsdy/pardosa/issues
[repository]:https://github.com/plylrnsdy/pardosa
