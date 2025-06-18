import { Server } from "socket.io";
import { socketAuth } from "../middleware/SocketAuth.middleware.js";
import { saveMessage } from "../controllers/Message.controllers.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      // origin: "http://localhost:5173",
      origin: "https://batuni.vercel.app",
      credentials: true,
    },
  });

  io.use(socketAuth);

  const userSocketMap = new Map()

   io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    userSocketMap.set(userId, socket.id);

    socket.on("message", async({ toUserId, content }) => {
      const message = await saveMessage({
        receiverId:toUserId,
        senderId:userId||socket.user._id,
        content,
      })
      const targetSocketId = userSocketMap.get(toUserId);
      if(targetSocketId){
        io.to(targetSocketId).emit("receive-message",message)
      }
    });

    socket.on("typing", async(toUserId)=>{
      const fromUserId = socket.user._id
      const targetSocketId = userSocketMap.get(toUserId)
      if(targetSocketId) io.to(targetSocketId).emit("show-typing", fromUserId);
    })

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  }); 
};
