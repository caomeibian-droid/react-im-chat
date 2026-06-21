import { useEffect,useRef,useState } from "react";

export default function useChatMessages(){
  const ws = useRef(null);
  //房间信息，切换房间，清空未读
 const userId = useRef(
     Math.random().toString(36).slice(2, 6)
   );
   const rooms = [
     { id: "room1", name: "小猫" },
     { id: "room2", name: "小狗" },
   ];
    const [currentRoom, setCurrentRoom] = useState("room1");
    const [messages, setMessages] = useState({
     room1: [],
     room2: [],
   });
    const [input, setInput] = useState("");

    //发送消息
    const [messageStatus,setmessageStatus]=useState("sending")

     const sendMessage = () => {
    if (!input.trim()) return;
    const id=crypto.randomUUID();
    const msg = {
      type: "msg",
      id: id,
      roomId: currentRoom,
      sender: userId.current,
      content: input,
     
    };
    const localMessage=  {
      ...msg,
     messageStatus:"sending"
    };
    //先乐观更新ui
    setMessages(prev => ({
  ...prev,
  [currentRoom]: [...prev[currentRoom], localMessage]
}));
console.log('发送时候的状态',status)
    
    //未连接，保存到队列
      if (status!="connected")
      {
       setPendingMessages(prev=>
       {
        const next=[...prev,msg];
        pendingRef.current=next;
        return next;
       })
      }
    ws.current.send(JSON.stringify(msg));
    setInput("");
  };
   //----------------状态管理------------
  const [status,setStatus]=useState("connecting");
 
   //未读处理   
     const [unread, setUnread] = useState({
       room1: 0,
       room2: 0,
     });

//用于onmessage里面，保证currentRoom是最新值
     const currentRoomRef = useRef(currentRoom);
     useEffect(() => {
       currentRoomRef.current = currentRoom;
     }, [currentRoom]);
   
//切换房间时候
  const switchRoom = (roomId) => {
    setCurrentRoom(roomId);
    setUnread((prev) => ({
      ...prev,
      [roomId]: 0,
    }));
  };

  //-----------保存信息
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{
    const history = localStorage.getItem('chatMessages');
    if(history)
    {
      setMessages(JSON.parse(history));//message添加历史记录，不是空
    }
    setLoaded(true);

  },[])
  useEffect(()=>{
    if(!loaded)//读完历史记录，再保存，防止直接保存空对象
    {
      return;
    }
    console.log("保存messages",messages)
  localStorage.setItem('chatMessages',JSON.stringify(messages));
},[messages])   

  //--------------队列----------
  const pendingRef = useRef([]);
  const [pendingMessages,setPendingMessages] = useState(()=>{
    const data=localStorage.getItem('pendingMessages');
    return data?JSON.parse(data):[];//设定刷新初始值
  })
  useEffect(()=>{
    console.log("保存pendingMessages",pendingMessages)
    localStorage.setItem('pendingMessages',JSON.stringify(pendingMessages));
    console.log("读取pendingMessages",JSON.parse(localStorage.getItem('pendingMessages')))
    
  },[pendingMessages])   //pendingMessages 改变，就保存
  
  
  //--------------function connect----------
  //调用hook,hook传props
 
 
  return {
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
  }
}