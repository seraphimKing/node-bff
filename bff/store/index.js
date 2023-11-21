const LRUCache = require('lru-cache');
const Redis = require('ioredis');

// 一般越上层的缓存过期时间就越短
class CacheStore {
  constructor() {
    this.stores = [];
  }

  add(store) {
    this.stores.push(store);
    return this;
  }

  async set(key, value) {
    for (const store of this.stores) {
      await store.set(key, value);
    }
  }

  async get(key) {
    for (const store of this.stores) {
      const value = await store.get(key);
      if (value !== undefined) {
        return value;
      }
    }
  }
}

class MemoryStore {
  constructor() {
    this.cache = new LRUCache.LRUCache({
      max: 100,
      // 一分钟过期
      ttl: 1000 * 60,
    });
  }

  async set(key, value) {
    this.cache.set(key, value);
  }

  async get(key) {
    return this.cache.get(key);
  }
}

class RedisStore {
  constructor(
    options = {
      host: 'localhost',
      port: '6379',
    }
  ) {
    this.client = new Redis(options);
  }

  async set(key, value) {
    this.client.set(key, JSON.stringify(value));
  }

  async get(key) {
    const val = await this.client.get(key);
    return val ? JSON.parse(val) : undefined;
  }
}

module.exports = {
  CacheStore,
  MemoryStore,
  RedisStore,
};