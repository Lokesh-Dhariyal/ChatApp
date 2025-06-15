import { connectDb } from "./Database/Database.db.js";
import {createServer} from "http"
import { app } from "./app.js";
import { setupSocket } from "./socket/index.js";
import dotenv from "dotenv"

dotenv.config({
  path: ".env",
});

const portNumber = process.env.PORT;

const server = createServer(app)
setupSocket(server)

connectDb()
  .then(() => {
    server.listen(portNumber || 6900, () => {
      console.log(`The server is running on the port ${portNumber}`);
    });
  })
  .catch((error) => {
    console.log("Connection Error", error);
  });
