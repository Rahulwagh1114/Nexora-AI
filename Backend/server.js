import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import { getAIResponse } from "./utils/aiClients.js";
import cookieParser from "cookie-parser";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js"
import authMiddleware from "./middleware/auth.js";

import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);           // Public — login/register
app.use("/api", authMiddleware, chatRoutes); // Protected — sirf logged-in user

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("Connected to database");
    } catch (err) {
        console.log("Failed to connect with db", err);
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});



