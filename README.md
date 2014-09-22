charset
----------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

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

use [iconv-lite](https://github.com/ashtuchkin/iconv-lite) to encode the body and set charset to content-type.

## Install

```
npm install koa-charset
```

## Usage

```
var koa = require('koa');
var charset = require('koa-charset');

var app = koa();
app.use(charset({ charset: 'gbk' }));

app.use(function* () {
  this.body = '你好';
});

```

## Options

* **charset**: set global charset by options.charset

## Manually turning charset on and off

You can set `this.charset` to cover the global charset.

```
app.use(function* () {
  this.charset = 'gb2312';
  this.body = '你好';
});
```

You can disable charset by `this.charset = false`.

```
app.use(function* () {
  this.charset = false;
  this.body = 'hello';
});
```

also this module will get the charset from `Content-Type`, so you can just use `koa-charset`,
then this middleware will automatically re-encode the body only if the charset is not utf8.

```
var app = koa();
app.use(charset());
app.use(function* () {
  var charset = this.acceptsCharsets('utf8', 'gbk') || 'utf8';
  this.vary('accept-charset');
  this.type = 'text/plain; charset=' + charset;
  this.body = 'something';
});
```

## License

MIT
