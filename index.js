/*!
 * snapshot - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var iconv = require('iconv-lite');

module.exports = function (options) {
  options = options || {};
  options.charset = options.charset || '';

  return function* charset(next) {
    yield* next;
    // manually turn off charset by `this.charset = false`
    if (this.charset === false) return;

    // first this.charset
    // then global.charset
    // at last check charset in `content-type`
    var charset = (this.charset
      || options.charset
      || parsetType(this.response.get('Content-Type'))).toLowerCase();

    if (!charset
      || charset === 'utf-8'
      || charset === 'utf8') return;
    if (!this.body) return;
    if (!text(this.type)) return;

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

/**
 * get charset from `contentType`
 */

function parsetType(type) {
  if (!type) return;
  var m = type.match(/charset *= *(\S+)/);
  if (m) return m[1];
}
