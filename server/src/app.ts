import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import tokenConfig from "./config/token";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

if (!tokenConfig.jwtSecret || !tokenConfig.jwtRefreshSecret) {
  throw new Error("JWT Secret not provided");
}

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
