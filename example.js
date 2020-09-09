const Koa = require('koa');
const charset = require('.');

const app = new Koa();

app.use(charset());
app.use(function (ctx) {
  ctx.body = 'Hello World！';
  ctx.type = 'text/html; charset=gbk';
});

app.listen(3000);