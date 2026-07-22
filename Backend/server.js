import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import { getAIResponse } from "./utils/aiClients.js";

import chartRotes from "./routes/chat.js";

import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.use("/api",chartRotes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});



const connectDB=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URI);
       console.log("Connected to database")
    }catch(err){
        console.log("Failed to connect with db",err)
    }
}

// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message, file } = req.body;
//     const reply = await getAIResponse(message, file);
//     res.json({ reply });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || "Something went wrong" });
//   }
// });

