const Koa = require('koa');
const router = require('koa-router')();
const logger = require('koa-logger');
const cacheMiddleware = require('./middleware/cache');
const MQMiddleware = require('./middleware/mq');
const rpcMiddleware = require('./middleware/rpc');
const log = require('./utils/log');

const app = new Koa();

app.use(logger());
app.use(
  rpcMiddleware({
    interfaceNames: ['com.puffmeow.user'],
  })
);
app.use(cacheMiddleware());
app.use(MQMiddleware());

app.use(router.routes()).use(router.allowedMethods());

router.get('/getUserInfo', async (ctx) => {
  const username = ctx.query.username;

  const cacheKey = `${ctx.method}-${ctx.path}-${username}`;
  let cacheData = await ctx.cache.get(cacheKey);

  // 把用户信息写入文件进行持久化，通过 Buffer 二进制发送
  log(ctx, {
    username,
  });

  if (cacheData) {
    ctx.body = cacheData;
    return;
  }

  const {
    rpcConsumers: { user },
  } = ctx;

  const userInfo = await user.invoke('getUserInfo', [username]);

  cacheData = {
    userInfo,
  };

  await ctx.cache.set(cacheKey, cacheData);

  ctx.body = cacheData;
});

// 插入一条 user 数据
router.get('/createUser', async (ctx) => {
  const username = ctx.query.username;
  log(ctx, {
    username,
  });

  const {
    rpcConsumers: { user },
  } = ctx;
  const res = await user.invoke('createUser', [username]);

  ctx.body = res;
});

app.listen(3000, () => {
  console.log('启动成功');
});


