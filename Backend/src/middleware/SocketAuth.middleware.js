import cookie from "cookie";
import { verifyToken } from "../utils/VerifyTokens.utils.js";

export const socketAuth = async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("Auth failed: No access token"));
    }

    const user = await verifyToken(token);
    if (!user) {
      return next(new Error("Auth failed: Invalid token"));
    }

    socket.user = user;
    next(); 
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Auth failed: Token verification error"));
  }
};
