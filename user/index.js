// 提供一些与用户相关的微服务
const {
  // 创建 rpc 服务器
  server: { RpcServer },
  // 创建注册中心，维护服务的注册信息，帮助节点和客户端找到对方
  registry: { ZookeeperRegistry },
} = require('sofa-rpc-node');


const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const logger = console;

let connection;

// 创建一个注册中心，用于注册微服务
const registry = new ZookeeperRegistry({
  // 记录日志
  logger,
  // zookeeper 的地址
  address: 'localhost:2181',
});

// 创建 rpc 服务器的实例
// 客户端连接 rpc 服务器的时候可以通过 zookeeper， 也可以直连 rpc 服务器
const server = new RpcServer({
  logger,
  registry,
  port: 10000,
});

(async function () {
  connection = await mysql.createConnection({
    host: 'localhost',
    port: '3304', // 在docker配置containers中对外暴露的port
    user: 'root',
    password: '123456',
    database: 'bff',
  });

  // 添加服务接口
  server.addService(
    {
      // 约定格式为域名反转+领域模型的名称
      interfaceName: 'com.puffmeow.user',
    },
    {
      async createUser(username) {
        const sql = `INSERT INTO user (id,username,phone) VALUES ('${uuidv4()}','${username}',185);`;
        // const sql = `show databases;`
        const rows = await connection.execute(sql);
        return {
          message: '创建成功',
          data: rows,
          success: true,
        };
      },
      async getUserInfo(username) {
        const sql = `SELECT id,username,phone from user WHERE username='${username}' limit 1`;
        const [rows] = await connection.execute(sql);

        return {
          message: '查询成功',
          data: rows[0],
          success: true,
        };
      },
    }
  );

  // 启动 rpc 服务
  await server.start();
  // 把启动好的 rpc 服务器注册到 zookeeper 中
  await server.publish();
  console.log('微服务启动');
})();
