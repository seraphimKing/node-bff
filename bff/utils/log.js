module.exports = log = (ctx, data) => {
  // 把用户信息写入文件进行持久化，通过 Buffer 二进制发送
  ctx.channels.logger.sendToQueue(
    'logger',
    Buffer.from(
      JSON.stringify({
        method: ctx.method,
        path: ctx.path,
        ...data,
      })
    )
  );
};