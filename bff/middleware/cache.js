const { RedisStore, CacheStore, MemoryStore } = require('../store');

const cacheMiddleware = (options) => {
  return async function (ctx, next) {
    // 创建一个缓存实例
    const cacheStore = new CacheStore();

    // 添加一些缓存层
    cacheStore.add(new MemoryStore());
    cacheStore.add(new RedisStore(options));

    ctx.cache = cacheStore;
    await next();
  };
};

module.exports = cacheMiddleware;