import Thread from "../models/Thread.js";
import express from "express";
const router = express.Router();
import  {getAIResponse} from "../utils/aiClients.js";


// Get all threds

router.get("/thread",async(req,res)=>{
    try{
    const threads=await Thread.find({}).sort({updatedAt:-1});
    //desending order of updatedAt...most recent data on top
    res.json(threads);
    }catch(err){
        console.log(err)
       return res.status(500).json({error:"Failed to featch threds"})
    }
});


router.get("/thread/:threadId",async(req,res)=>{
     const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId})

        if(!thread){
          return  res.status(404).json({error:"Thread not found"});
        }else{
          return  res.json(thread.message);
        }
    }catch(err){
         console.log(err)
        return res.status(500).json({error:"Failed to featch Chat"})
    }
})


router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const threadDeleted=await Thread.findOneAndDelete({threadId});
        if(!threadDeleted){
          return  res.status(500).json({error:"Thread not found"})
        }else{
          return  res.status(200).json({success:"Thred deleted sucessfully"});
        }
    }catch(err){
        console.log(err)
       return res.status(500).json({error:"Faild to featch chat"})
    }
})


router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  console.log("Received message:", message); // debug ke liye temporarily

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required field" }); // return zaroori
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        message: [{ role: "user", content: message }],
      });
    } else {
      thread.message.push({ role: "user", content: message });
    }

    const assistantReply = await getAIResponse(message);

    thread.message.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    return res.json({ reply: assistantReply });   // yahan bhi return laga dein (safe practice)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });  // yahan bhi return
  }
});


export default router;