import { createContext, useContext, useEffect, useState } from "react";
import {socket} from "../socket";
import { useUser } from "../hooks/useUser";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages,setMessages] = useState([])
  const {user} = useUser()
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if(user&&socket.disconnected){
      socket.connect()
    }
    const onConnect = () => {
      console.log("🟢 Socket Connected");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("🔴 Socket Disconnected");
      setIsConnected(false);
    };
    const receiveMessage = (msg)=>{
        setMessages((prev) => [...prev, msg]);
    }

    const typingUser = (fromUser)=>{
      setTypingUser(fromUser);
      setTimeout(() => setTypingUser(null), 2000);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message",receiveMessage)
    socket.on("show-typing",typingUser)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message",receiveMessage)
      socket.off("show-typing",typingUser)
    }
  }, [user?._id]);

  const sendMessage = (toUserId, content) => {
    const newMessage = {
      sender: user._id,
      receiver: toUserId,
      content,
    };
    socket.emit("message", { toUserId, content });
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const typing = (toUserId)=>{
   socket.emit("typing",toUserId)   
  }
  
  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, setMessages,messages,typing, typingUser, setTypingUser }}>
      {children}
    </SocketContext.Provider>
  );
};
