'use strict';

const typer = require('content-type');
const iconv = require('iconv-lite');

module.exports = function (options) {
  options = options || {};
  options.charset = options.charset || '';

  // eslint-disable-next-line func-names
  return async function charset(ctx, next) {
    await next();

    // manually turn off charset by `ctx.charset = false`
    if (ctx.charset === false || !ctx.body || !text(ctx.type)) return;

    const contentType = ctx.response.get('Content-Type');

    // first ctx.charset
    // then global.charset
    // at last check charset in `content-type`
    const charset = (
      ctx.charset ||
      options.charset ||
      typer.parse(contentType).parameters.charset ||
      ''
    ).toLowerCase();

    if (!charset || charset === 'utf-8' || charset === 'utf8') return;

    // set type with charset
    const { type } = ctx;
    ctx.type = `${type}; charset=${charset}`;

    // buffer / string body
    if (Buffer.isBuffer(ctx.body) || typeof ctx.body === 'string') {
      ctx.body = iconv.encode(ctx.body, charset);
      return;
    }

    // stream body
    if (typeof ctx.body.pipe === 'function') {
      ctx.body = ctx.body.pipe(iconv.decodeStream('utf8'));
      ctx.body = ctx.body.pipe(iconv.encodeStream(charset));
      return;
    }

    // json body
    ctx.body = iconv.encode(JSON.stringify(ctx.body), charset);
  };
};

// need to set charset if is text
function text(type) {
  if (/^text\//.test(type)) return true;
  if (type === 'application/json') return true;
}
