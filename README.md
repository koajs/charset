[koa-charset][github-repo]
----------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[github-repo]: https://github.com/koajs/charset
[npm-image]: https://img.shields.io/npm/v/koa-charset.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-charset
[travis-image]: https://img.shields.io/travis/koajs/charset.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/charset
[coveralls-image]: https://img.shields.io/coveralls/koajs/charset.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/charset?branch=master
[david-image]: https://img.shields.io/david/koajs/charset.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/charset
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.11-red.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

Use [iconv-lite](https://github.com/ashtuchkin/iconv-lite) to encode the body and set charset to content-type.

## Install

```bash
# npm ..
npm i koa-charset
# yarn ..
yarn add koa-charset
```

## Usage

```
const Koa = require('koa');
const charset = require('koa-charset');

const app = new Koa();

app.use(charset());
app.use(function (ctx) {
  ctx.body = '你好';
  ctx.type = 'text/html; charset=gbk';
});

app.listen(3000);
```

## Options

* **charset**: set global charset by options.charset

## Manually turning charset on and off

You can set `ctx.charset` to cover the global charset.

```
app.use(function (ctx) {
  ctx.charset = 'gb2312';
  ctx.body = '你好';
});
```

You can disable charset by `ctx.charset = false`.

```
app.use(function (ctx) {
  ctx.charset = false;
  ctx.body = 'hello';
});
```

also this module will get the charset from `Content-Type`, so you can just use `koa-charset`,
then this middleware will automatically re-encode the body only if the charset is not utf8.

```
const app = new Koa();
app.use(charset());
app.use(function () {
  const charset = ctx.acceptsCharsets('utf8', 'gbk') || 'utf8';
  ctx.vary('accept-charset');
  ctx.type = `text/plain; charset=${charset}`;
  ctx.body = 'something';
});
```

## License

[MIT](LICENSE)
