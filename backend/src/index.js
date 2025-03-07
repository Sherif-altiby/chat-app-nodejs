import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messagesRoute from "./routes/messages.route.js";
import { app, server } from "./lib/socket.js";
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoute);
app.use("/api/messages", messagesRoute);

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port 5000`);
});

