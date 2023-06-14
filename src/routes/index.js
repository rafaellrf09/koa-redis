const Router = require('koa-router');
const { ObjectId } = require('mongodb');
const { setRedis, getRedis } = require('../databases/redis');
const router = new Router();

router.get('/', (ctx) => {
    ctx.body = 'Olá, mundo!';
});

router.post('/users', async (ctx) => {
    const usuario = ctx.request.body; // Supondo que o corpo da requisição possui os dados do usuário a serem inseridos
    await ctx.db.collection("users").insertOne(usuario);
    ctx.status = 201; // Retorna o usuário inserido como resposta
});

router.get('/users', async (ctx) => {
    const usuarios = await ctx.db.collection("users").find().toArray();
    ctx.body = usuarios;
});

router.get('/users/:id', async (ctx) => {
    try {
        const id = new ObjectId(ctx.request.params.id);
        console.time()

        const userRedis = await getRedis(`user-${ctx.request.params.id}`);
        if (userRedis) {
            console.log("Usando o redis")
            console.timeEnd()
            ctx.body = JSON.parse(userRedis);
            return;
        }
        
        const usuario = await ctx.db.collection("users").findOne({ _id: id });
        console.timeEnd()
        await setRedis(`user-${ctx.request.params.id}`, JSON.stringify(usuario));

        ctx.body = usuario;
    } catch (error) {
        console.log("error", error)
    }
   
});

module.exports = router;