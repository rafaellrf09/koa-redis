const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const router = require("./src/routes");
const MongoDb = require("./src/databases/mongo")

const app = new Koa();

// Use o middleware do logger
app.use(logger());

// Use o middleware koaMongo para disponibilizar o banco de dados nas solicitações Koa
app.use(async (ctx, next) => {
    ctx.dbClient = await MongoDb.connect();
    ctx.db = ctx.dbClient.db("test");
    await next();
    ctx.dbClient.close();
});

// Middleware para tratar erros
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err);
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

// routes
app.use(bodyParser())
.use(router.allowedMethods())
.use(router.routes());

app.listen(3000, () => {
    console.log("listening on port 3000")
});