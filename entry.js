const mount = require('koa-mount');
const koa = require('koa');
const url = require('url')

const app = new koa;

app.use(async (ctx, next)=> {
    const parsedUrl = url.parse(ctx.url);
    if (
        (parsedUrl.pathname === '/download') || 
        (parsedUrl.pathname === '/detail') || 
        (parsedUrl.pathname === '/play') || 
        (parsedUrl.pathname === '/list')
    ) {
        parsedUrl.pathname = parsedUrl.pathname + '/'
        ctx.redirect(url.format(parsedUrl));
        return
    }

    await next();
})


app.use(
    mount('/detail', require('./detail/index'))
)

app.use(
    mount('/download', require('./download/index'))
)

app.use(
    mount('/play', require('./play/index'))
)

app.use(
    mount('/list', require('./list/node/index'))
)


app.listen(3000, ()=> {
    console.log('listened 3000')
})