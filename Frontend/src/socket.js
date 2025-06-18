import { io } from "socket.io-client";

const socket = io("https://batuni-q9u9.onrender.com", {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

export {socket};
