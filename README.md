charset
----------

[![Build Status](https://secure.travis-ci.org/koajs/charset.svg)](http://travis-ci.org/koajs/charset)

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

## License

MIT
