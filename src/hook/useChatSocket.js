import { useState ,useEffect,useRef,} from 'react';

export default function useChatSocket(
    //接收的参数
    {
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
    pendingRef,
    switchRoom,
    unread,
    setUnread,
    currentRoomRef,
    
    pendingMessages,
    setPendingMessages,
}){
   //....
  
  const retryCount = useRef(0);
  const heartbeatRef = useRef(null);
  const timeoutRef = useRef(null);
  
   function connect(){  
    if(ws.current) {
      ws.current.onclose=null;
      ws.current.close();
    }
    ws.current = new WebSocket("ws://localhost:3000");
    setStatus("connecting");
    
  //心跳
  ws.current.onopen=()=>{
     console.log("连接成功");
     setStatus("connected");
      retryCount.current = 0;
  heartbeatRef.current = setInterval(()=>{
       console.log('心跳设置成功'),
      ws.current.send(JSON.stringify({type:"ping"}));
   
   clearTimeout(timeoutRef.current);
       timeoutRef.current = setTimeout(()=>{
        
      console.log('心跳超时，关闭连接 ');
     ws.current.close();
    },5000);
   
   }, 10000);
  //连接上网络，补发
  console.log('pendingMessages',pendingRef.current)
      if(pendingRef.current.length>0)
      {
       pendingRef.current.forEach((msg) => {    
        console.log(msg.id,'补发消息')
          ws.current.send(JSON.stringify(msg));
          });
      
        
      }
  }
//---------------
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
     
   //心跳
    if(msg.type=='pong')
    {console.log('收到心跳')
      clearTimeout(timeoutRef.current);
      return;
    }
  //ack
  if(msg.type=='ack')
  { setMessages(prev=>{
    const copy={...prev};
    for(const roomId in copy){
      copy[roomId]=copy[roomId].map(m =>
m.id === msg.id
? { ...m, messageStatus: "sent" }: m
);
    }
return {  
     copy  
  };  
  
});  
setTimeout(()=>{
   setMessages(prev=>{
    const copy={...prev};
    for(const roomId in copy){
      copy[roomId]=copy[roomId].map(m =>
m.id === msg.id
? { ...m, messageStatus: null }: m
);
    }
return {  
     copy  
  };  
});  
},5000)
return;
   //这里才是if的return
  }

      // 👉 按 room 分类存储,正常消息广播
     setMessages((prev)=>{
      const roomId=msg.roomId;
     const list=prev[roomId]||[];
     const exist=list.find(item=>item.id===msg.id);
     if(exist)
     {
      return prev;
     }
     return{
      ...prev,
      [roomId]: [...list, 
        msg,
      ],
     }
     })
        
     
      // 👉 非当前房间才计未读
      if (msg.roomId !== currentRoomRef.current) {
        setUnread((prev) => ({
          ...prev,
          [msg.roomId]: (prev[msg.roomId] || 0) + 1,
        }));
      }
      //回复之后，清空队列，防止重复发送
      setPendingMessages((prev) => {const next=prev.filter(m=>m.id!==msg.id);
    pendingRef.current=next;
    return next;
    });
    };
    //心跳
     ws.current.onclose=()=>{
      console.log('网络已断开')
      setStatus("reconnecting");
      clearInterval(heartbeatRef.current);
      clearTimeout(timeoutRef.current);
      reconnect();
      
    }
  }
   function reconnect(){
    if(retryCount.current>=10)
    {
      console.log('重连失败')
      setStatus("offline");
     
      return;
    }

    retryCount.current++;
    console.log(`第${retryCount.current}次重连中`);
    const time=Math.min(Math.pow(2,retryCount.current)*1000,20000)
    const random=Math.random()*1000
    const delay=time+random
    setTimeout(()=>{
      connect();
    },delay);
  }
  useEffect(()=>{
    connect();
    return ()=>{
      ws.current?.close();
    }
  },[]);
}