import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import  useChatSocket  from "./hook/useChatSocket";
import useChatMessages from "./hook/useChatMessages";

export default function App() {
 
//----------------用户id------------
  
const {ws,
    messages,
    setMessages,
    status,
    setStatus,
    rooms,
    currentRoom,
    setCurrentRoom,
    input,
    setInput,
    sendMessage,
    switchRoom,
    unread,
    setUnread,
    currentRoomRef,
    pendingMessages,
    setPendingMessages,
    messageStatus,
    setmessageStatus,
    pendingRef,
  } = useChatMessages();
  
  useChatSocket({
    ws,
    messages,
    setMessages,
    status,
    setStatus,
    rooms,
    currentRoom,
    setCurrentRoom,
    input,
    setInput,
    sendMessage,
    switchRoom,
    unread,
    setUnread,
    currentRoomRef,
    pendingMessages,
    setPendingMessages,
    messageStatus,
    setmessageStatus,
    pendingRef,
  });
  //----------------虚拟化列表------------
  const parentRef = useRef(null);
  const currentMessages = messages[currentRoom] || [];
  const rowVirtualizer=useVirtualizer({
    count:currentMessages.length,
    getScrollElement:()=>parentRef.current,
    estimateSize:()=>35,

  })
  const virtualItems=rowVirtualizer.getVirtualItems();

  
 
  
  return (
    <div style={{ display: "flex", padding: 20 }}>
      <div style={{ padding: 10 }}>
        <div>
  {status === "connected" && "🟢 已连接"}
  {status === "connecting" && "🟡 连接中"}
  {status === "reconnecting" && "🟠 重连中"}
  {status === "offline" && "🔴 已离线"}
</div>
      </div>
      {/* 左侧房间列表 */}
      <div style={{ width: 150 }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => switchRoom(room.id)}
            style={{
              padding: 10,
              cursor: "pointer",
              background:
                currentRoom === room.id ? "#eee" : "#fff",
            }}
          >
            {room.name}

            {unread[room.id] > 0 && (
              <span style={{ color: "red", marginLeft: 6 }}>
                {unread[room.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 中间聊天区 */}
      <div style={{ flex: 1, marginLeft: 20 }}>
     <div ref={parentRef} style={{height:500,overflowY:"auto"}}>
      <div style={{height:rowVirtualizer.getTotalSize(),position:"relative"}}>
        {virtualItems.map((item)=>{
          const message=currentMessages[item.index];
          return(
            
            <div key={item.key} style={{position:"absolute",transform:`translateY(${item.start}px)`}}>
              <b>{message.sender}:</b> {message.content}
              {messageStatus&&(
                <>
              {message.messageStatus==="sending"&&<span style={{color:"blue"}}>发送中...</span>}
              {message.messageStatus==="sent"&&<span style={{color:"green"}}>已发送</span>}
                </>
              )}
              </div>
          )
        })}
      </div>

      </div>
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>发送</button>
        </div>
      </div>
    </div>
  );
}
