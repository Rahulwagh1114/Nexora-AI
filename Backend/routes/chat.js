import Thread from "../models/Thread.js";
import express from "express";
const router = express.Router();
import { getAIResponse } from "../utils/aiClients.js";

router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to fetch threads" })
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, userId: req.userId });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        return res.json(thread.message);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to fetch chat" })
    }
})

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const threadDeleted = await Thread.findOneAndDelete({ threadId, userId: req.userId });
        if (!threadDeleted) {
            return res.status(404).json({ error: "Thread not found" })
        }
        return res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Failed to delete chat" })
    }
})

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required field" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId: req.userId });

        if (!thread) {
            const shortTitle = message.length > 40 ? message.slice(0, 40).trim() + "..." : message;
            thread = new Thread({
                threadId,
                userId: req.userId,
                title: shortTitle,
                message: [{ role: "user", content: message }],
            });
        } else {
            thread.message.push({ role: "user", content: message });
        }

        const assistantReply = await getAIResponse(message);
        thread.message.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        return res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;