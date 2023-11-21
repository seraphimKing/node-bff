const amqp = require('amqp-connection-manager');

const MQMiddleware = (
  options = {
    url: 'amqp://localhost',
  }
) => {
  return async function (ctx, next) {
    // 连接 MQ 服务器
    const mqClient = await amqp.connect(options.url);
    // 创建一个通道
    const logger = await mqClient.createChannel();
    // 创建一个名称为 logger 的队列，如果已经存在了，不会重复创建
    await logger.assertQueue('logger');
    // 将其挂载到 ctx.channels 中，其它地方就能进行调用了
    ctx.channels = {
      logger,
    };

    await next();
  };
};

module.exports = MQMiddleware