import { io } from "socket.io-client";

const socket = io("http://localhost:6900", {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

export {socket};
