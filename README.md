### 原地址
https://juejin.cn/post/7222079859710869541?searchId=20231121090739DC9B93CC418AAC63EEE4


1. bff 用于和前端交互的 bff 胶水层
2. user 用户相关的微服务函数
3. write-logger 写入日志的服务


## 启动流程
1. 【安装docker】images里pull `mysql、redis、zookeeper、rabbitmq`，分别添加containers
2. 【安装Navicat】有14天试用期，其他也可用`datagrip、workbench、DBeaver`替代。
3. 【连接Navicat到docker】，利用Navicat工具方便的可以查看mysql对数据库表的增删改。
4. 【安装npm包】目录bff、user、write-logger分别进入进行`npm install`包安装。
5. 【修改port】到每个连接服务里去看对应的port端口是否跟你docker里跑起来的一致，Port: xxx|yyy, xxx为docker对外暴露的端口。
6. 【访问接口获取和塞数据】http://localhost:3000/createUser?username=test ｜ http://localhost:3000/getUserInfo?username=test