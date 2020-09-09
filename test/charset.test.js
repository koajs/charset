'use strict';

require('mocha');
const Koa = require('koa');
const charset = require('..');
const request = require('supertest');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const should = require('should');

describe('test/charset.test.js', function () {

  it('should encode ok', function (done) {
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = '你好';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gbk')
    .expect(iconv.encode('你好', 'gbk').toString(), done);
  });

  it('should html ok', function (done) {
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = '<html>你好</html>';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html; charset=gbk')
    .expect(iconv.encode('<html>你好</html>', 'gbk').toString(), done);
  });

  it('should json ok', function (done) {
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = {hello: '你好'};
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'application/json; charset=gbk')
    .expect(iconv.encode(JSON.stringify({hello: '你好'}), 'gbk').toString(), done);
  });

  it('should buffer ok', function (done) {
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = Buffer.from('你好');
      ctx.type = 'html';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html; charset=gbk')
    .expect(iconv.encode('你好', 'gbk').toString(), done);
  });

  it('should stream ok', function (done) {
    const fixture = path.join(__dirname, 'fixture.txt');
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = fs.createReadStream(fixture, 'utf8');
      ctx.type = 'txt';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gbk')
    .expect(iconv.encode(fs.readFileSync(fixture), 'gbk').toString(), done);
  });

  it('should cover by ctx.charset', function (done) {

    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.charset = 'gb2312';
      ctx.body = '你好';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gb2312')
    .expect(iconv.encode('你好', 'gb2312').toString(), done);
  });

  it('should ignore by ctx.charset=false', function (done) {
    const app = new Koa();
    app.use(charset({charset: 'gbk'}));
    app.use(function (ctx) {
      ctx.charset = false;
      ctx.body = 'hello';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=utf-8', done);
  });

  it('should ignore if no body', function (done) {
    const app = new Koa();
    app.use(charset());
    app.use(function (ctx) {
      ctx.charset = 'gbk';
      ctx.body = null;
    });

    request(app.callback())
    .get('/')
    .expect(204, function (err, res) {
      should.not.exist(res.headers['Content-Type']);
      done(err);
    });
  });

  it('should ignore if non-text', function (done) {
    const fixture = path.join(__dirname, 'fixture.txt');
    const app = new Koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function (ctx) {
      ctx.body = fs.createReadStream(fixture, 'utf8');
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'application/octet-stream', done);
  });

  it('should ignore with utf8', function (done) {
    const app = new Koa();
    app.use(charset());
    app.use(function (ctx) {
      ctx.charset = 'utf8';
      ctx.body = '你好';
      ctx.set('Content-Type', 'text/html');
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html', done);
  });

  it('should ignore without charset', function (done) {
    const app = new Koa();
    app.use(charset());
    app.use(function (ctx) {
      ctx.body = '你好';
      ctx.set('Content-Type', 'text/html');
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html', done);
  });

  it('should get charset from content-type', function (done) {
    const app = new Koa();
    app.use(charset());
    app.use(function (ctx) {
      ctx.type = 'text/html; charset=gbk';
      ctx.body = '你好';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html; charset=gbk')
    .expect(200)
    .expect(iconv.encode('你好', 'gbk').toString(), done);
  });
});
