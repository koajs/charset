
var koa = require('koa');
var charset = require('./');

var app = koa();

app.use(charset());
app.use(function* () {
  this.body = '你好！';
  this.charset = 'gbk';
  this.type = 'html';
});

app.listen(3000);
