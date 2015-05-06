/*!
 * snapshot - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var typer = require('content-type');
var iconv = require('iconv-lite');

module.exports = function (options) {
  options = options || {};
  options.charset = options.charset || '';

  return function* charset(next) {
    yield* next;
    // manually turn off charset by `this.charset = false`
    if (this.charset === false) return;
    if (!this.body) return;
    if (!text(this.type)) return;

    var contentType = this.response.get('Content-Type');

    // first this.charset
    // then global.charset
    // at last check charset in `content-type`
    var charset = (this.charset
      || options.charset
      || typer.parse(contentType).parameters.charset
      || '').toLowerCase();

    if (!charset
      || charset === 'utf-8'
      || charset === 'utf8') return;

    // set type with charset
    var type = this.type;
    this.type = type + '; charset=' + charset;

    // buffer / string body
    if (Buffer.isBuffer(this.body) || typeof this.body === 'string') {
      return this.body = iconv.encode(this.body, charset);
    }
    // stream body
    if (typeof this.body.pipe === 'function') {
      this.body = this.body.pipe(iconv.decodeStream('utf8'));
      this.body = this.body.pipe(iconv.encodeStream(charset));
      return;
    }
    // json body
    this.body = iconv.encode(JSON.stringify(this.body), charset);
  }
}

/**
 * need to set charset if is text
 */

function text(type) {
  if (/^text\//.test(type)) return true;
  if (type === 'application/json') return true;
}
