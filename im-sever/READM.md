React IM Chat

一个基于 React 和 WebSocket 实现的即时通讯（IM）项目，支持实时消息收发、多聊天室切换以及消息可靠传输等功能，旨在模拟真实聊天应用的核心通信流程，并实践 React 状态管理与 WebSocket 通信。

 功能特性

- 实时聊天（WebSocket）
- 多聊天室切换
- 消息持久化（LocalStorage）
- WebSocket 自动重连
- 心跳检测（Heartbeat）
- ACK 消息确认机制
- 消息超时重发
- 消息发送状态管理
- 虚拟列表优化消息渲染
- 自定义 React Hooks，拆分业务逻辑

 技术栈

- React
- JavaScript (ES6+)
- WebSocket
- Vite

📂 项目结构

src/
├── hook/
│   ├── useChatSocket.js      // WebSocket 连接与通信
│   └── useChatMessages.js    // 消息及聊天室状态管理
├── components/
├── App.jsx
└── main.jsx

🚀 本地运行

npm install
npm run dev
node im-sever/index.js

项目亮点

- 使用自定义 Hooks 将 WebSocket 通信与业务状态解耦，提高代码可维护性。
- 通过 ACK + 超时重发机制提高消息可靠性，避免网络波动导致消息丢失。
- 使用心跳机制检测连接状态，并结合自动重连提升应用稳定性。
- 使用虚拟列表优化长消息列表渲染性能，减少大量 DOM 带来的性能开销。
- 使用 LocalStorage 保存聊天数据，实现页面刷新后消息仍可恢复。

 后续可优化方向

- 消息已读/未读状态
- 图片、文件发送
- 用户登录与身份认证
- 群聊成员管理
- 消息搜索
- 表情与富文本支持