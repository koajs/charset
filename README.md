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
