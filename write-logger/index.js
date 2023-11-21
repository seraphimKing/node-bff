// 用于连接 RabbitMQ 服务器
// const amqp = require('amqplib');
const amqp = require('amqp-connection-manager');
const fs = require('fs-extra');

(async function () {
  // 连接 MQ 服务器
  try {
    const mqClient = await amqp.connect(['amqp://localhost']);
    // 创建一个通道
    const logger = await mqClient.createChannel();
    // 创建一个名称为 logger 的队列，如果已经存在了，不会重复创建
    await logger.assertQueue('logger');
    // 消费队列里的消息
    logger.consume('logger', async (event) => {
      // 往本地写入日志文件，到时候 bff 端会以 Buffer 二进制的形式发送数据过来
      await fs.appendFile('./logger.txt', event.content.toString() + '\n');
    });
  } catch(err) {
    console.log('err:', err)
  }
})();
