import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;   // ✅ fixed spelling

    if (!authHeader || !authHeader.startsWith("Bearer ")) {   // ✅ startsWith
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];   // ✅ index 1, "i" nahi

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });   // ✅ "error" spelling fix (pehle "erroe" tha)
    }
}

export default authMiddleware;