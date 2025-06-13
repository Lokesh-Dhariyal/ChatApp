import { connectDb } from "./Database/Database.db.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

const portNumber = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(portNumber || 6900, () => {
      console.log(`The server is running on the port ${portNumber}`);
    });
  })
  .catch((error) => {
    console.log("Connection Error", error);
  });
