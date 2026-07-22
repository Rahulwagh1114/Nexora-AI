import Thread from "../models/Thread.js";
import express from "express";
const router = express.Router();
import  {getAIResponse} from "../utils/aiClients.js";

router.post("/chat",async(req,res)=>{
    try{
    const newChat=new Thread({
        threadId:"1233",
        title:"Testing new Thread"
    })

    const respose=await newChat.save();
    res.send(respose);
}catch(err){
    console.log(err);
     res.status(500).json({error:"Failed to save in DB"})
}
})

// Get all threds

router.get("/thread",async(req,res)=>{
    try{
    const threads=await Thread.find({}).sort({updatedAt:-1});
    //desending order of updatedAt...most recent data on top
    res.json(threads);
    }catch(err){
        console.log(err)
        res.status(500).json({error:"Failed to featch threds"})
    }
});


router.get("/thread/:threadId",async(req,res)=>{
     const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId})

        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }else{
            res.json(thread.message);
        }
    }catch(err){
         console.log(err)
        res.status(500).json({error:"Failed to featch Chat"})
    }
})


router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const threadDeleted=await Thread.findOneAndDelete({threadId});
        if(!threadDeleted){
            res.status(500).json({error:"Thread not found"})
        }else{
            res.status(200).json({success:"Thred deleted sucessfully"});
        }
    }catch(err){
        console.log(err)
        res.status(500).json({error:"Faild to featch chat"})
    }
})


router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.params;
    if(!threadId || !message){
        res.status(500).json({error:"missing required field"})
    }

    try{
        let thread=await Thread.findOne({threadId});

        if(!thread){
            //create a thred in db
            thread=new Thread({
                threadId,
                title:message,
                message:[{role:"user", content:message}]
            })
        }else{
            thread.message.push({role:"user",content:message});
        }
        const assistantReply= await getAIResponse(message);

        thread.message.push({role:"assistant", content:assistantReply});
        thread.updatedAt=new Date();

        await thread.save();
        res.json({reply:assistantReply});

    }catch(err){
     console.log(err);
     res.status(500).json({error:"something went wrong"});
    }
})


export default router;