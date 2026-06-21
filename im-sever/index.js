const WebSocket = require("ws");

console.log("服务器启动成功");

const wss = new WebSocket.Server({ port: 3000 });
//---------去重---------
const messageSet = new Set();

wss.on("connection", (ws) => {
  console.log("用户连接");

  ws.on("message", (message) => {
    const msg = JSON.parse(message.toString());
    console.log("收到消息:", msg);

    if (msg.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
      return;
    }

    if(messageSet.has(msg.id)){
      return;
    }
    else{
      messageSet.add(msg.id);
    ws.send(JSON.stringify({type:"ack",id:msg.id}));
    console.log(msg.id,'收到')
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    })};
  });

  ws.on("close", () => {
    console.log("用户断开连接");
  });
});