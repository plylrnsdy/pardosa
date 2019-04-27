# Change Log

## 0.2.0
* `storage.file()` save `ctx.state.files[].content` to `ctx.state.files[].file`.

## 0.1.9
+ Response#`$`, equivalent to `Cheerio.load(ctx.response.body)`.

## 0.1.8
+ Response#`extension()`;
* new interface of request object.

## 0.1.6
* Fix can not interrupt middlewares after throwed error;
+ Add middleware `clean-stack()`.

## 0.1.5
+ Add middleware `inspect`, print `ctx` field by JSON Path;
* `storage.file()` can save `ctx.response.body` to `ctx.state.file`.

## 0.1.4
* Fix middleware `router` compose empty middleware when route or middlewares is empty.

## 0.1.3
* Use `*.d.ts` instead of `*.ts` for declaration in NPM package;
* Use `peerDependencies` to depend declaration modules `@type/...`.
* Remove wrong declaration.

## 0.1.0
+ Compose middlewares (Koa like APIs);
+ 5 build-in middlewares.
