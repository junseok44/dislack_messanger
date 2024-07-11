import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import tokenConfig from "./config/token";
import channelRoutes from "./routes/channelRoutes";
import serverRoutes from "./routes/serverRoutes";
import { initializeSocket } from "./sockets";
import http from "http";

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

initializeSocket(server);

app.use("/auth", authRoutes);
app.use("/channels", channelRoutes);
app.use("/server", serverRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

if (!tokenConfig.jwtSecret || !tokenConfig.jwtRefreshSecret) {
  throw new Error("JWT Secret not provided");
}

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
