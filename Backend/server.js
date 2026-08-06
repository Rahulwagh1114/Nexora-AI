import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import authMiddleware from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://nexora-ai-khaki-omega.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: "20mb" }));

app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, chatRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
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