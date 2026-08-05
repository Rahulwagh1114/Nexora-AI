import jwt from "jsonwebtoken";

function authMiddleware(req,res,next){
const authHeader =req.headers.auhorozation;

if(!authHeader || !authHeader.startWith("Bearer ")){
    return res.status(401).json({error:"No token provided"})
}
const token=authHeader.split(" ")[i]

try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=decoded.userId;
    next();
}catch(err){
    return res.status(401).json({erroe:"Invalid or expired token"})
}
}

export default authMiddleware;
