
var koa = require('koa');
var charset = require('./');

var app = koa();

app.use(charset());
app.use(function* () {
  this.body = '你好！';
  this.type = 'text/html; charset=gbk';
});

app.listen(3000);
