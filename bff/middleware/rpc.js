const {
  // 创建 rpc 服务器
  client: { RpcClient },
  // 创建注册中心，维护服务的注册信息，帮助节点和客户端找到对方
  registry: { ZookeeperRegistry },
} = require('sofa-rpc-node');
const logger = console;

const rpcMiddleware = (options = {}) => {
  return async function (ctx, next) {
    // 创建一个注册中心，用于注册微服务
    const registry = new ZookeeperRegistry({
      // 记录日志
      logger,
      // zookeeper 的地址
      address: 'localhost:2181',
    });

    const client = new RpcClient({
      logger,
      registry,
    });

    const interfaceNames = options.interfaceNames || [];
    const rpcConsumers = {};

    for (let i = 0; i < interfaceNames.length; i++) {
      const interfaceName = interfaceNames[i];

      // 创建 RPC 服务器的消费者,通过消费者调用 rpc 接口
      const consumer = client.createConsumer({ interfaceName });
      // 等待服务就绪
      await consumer.ready();

      rpcConsumers[interfaceName.split('.').pop()] = consumer;
    }

    ctx.rpcConsumers = rpcConsumers;
    await next();
  };
};

module.exports = rpcMiddleware;