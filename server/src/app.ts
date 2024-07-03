import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
