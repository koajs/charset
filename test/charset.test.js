/*!
 * charset - test/charset.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var charset = require('..');
var koa = require('koa');
var request = require('supertest');
var iconv = require('iconv-lite');
var fs = require('fs');
var path = require('path');
var should = require('should');

describe('test/charset.test.js', function () {

  it('should encode ok', function (done) {
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = '你好';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gbk')
    .expect(iconv.encode('你好', 'gbk').toString(), done);
  });

  it('should html ok', function (done) {
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = '<html>你好</html>';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html; charset=gbk')
    .expect(iconv.encode('<html>你好</html>', 'gbk').toString(), done);
  });

  it('should json ok', function (done) {
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = {hello: '你好'};
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'application/json; charset=gbk')
    .expect(iconv.encode(JSON.stringify({hello: '你好'}), 'gbk').toString(), done);
  });

  it('should buffer ok', function (done) {
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = new Buffer('你好');
      this.type = 'html';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html; charset=gbk')
    .expect(iconv.encode('你好', 'gbk').toString(), done);
  });

  it('should stream ok', function (done) {
    var fixture = path.join(__dirname, 'fixture.txt');
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = fs.createReadStream(fixture, 'utf8');
      this.type = 'txt';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gbk')
    .expect(iconv.encode(fs.readFileSync(fixture), 'gbk').toString(), done);
  });

  it('should cover by this.charset', function (done) {

    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.charset = 'gb2312';
      this.body = '你好';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=gb2312')
    .expect(iconv.encode('你好', 'gb2312').toString(), done);
  });

  it('should ignore by this.charset=false', function (done) {
    var app = koa();
    app.use(charset({charset: 'gbk'}));
    app.use(function* () {
      this.charset = false;
      this.body = 'hello';
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/plain; charset=utf-8', done);
  });

  it('should ignore if no body', function (done) {
    var app = koa();
    app.use(charset());
    app.use(function* () {
      this.charset = 'gbk';
      this.body = null;
    });

    request(app.callback())
    .get('/')
    .expect(204, function (err, res) {
      should.not.exist(res.headers['Content-Type']);
      done(err);
    });
  });

  it('should ignore if non-text', function (done) {
    var fixture = path.join(__dirname, 'fixture.txt');
    var app = koa();
    app.use(charset({ charset: 'gbk'} ));
    app.use(function* () {
      this.body = fs.createReadStream(fixture, 'utf8');
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'application/octet-stream', done);
  });

  it('should ignore with utf8', function (done) {
    var app = koa();
    app.use(charset());
    app.use(function* () {
      this.charset = 'utf8';
      this.body = '你好';
      this.set('Content-Type', 'text/html');
    });

    request(app.callback())
    .get('/')
    .expect('Content-type', 'text/html', done);
  });
});
