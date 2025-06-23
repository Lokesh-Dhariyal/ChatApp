import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const limit = "16kb";

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://batuni.vercel.app",
    // origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ extended: true, limit: limit }));
app.use(express.static("public"));
app.use(cookieParser());

import { userRoute } from "./routes/User.route.js";
import { groupRoute } from "./routes/Group.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/group",groupRoute)

import { errorMiddleware } from "./middleware/Error.middleware.js";
app.use(errorMiddleware);
export { app };
