import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import User from "../models/user.js";
import sessionModel from "../models/session.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        const isAlreadyExist = await User.findOne({ email });

        if (isAlreadyExist) {
            return res.status(409).json({
                error: "Email is already registered"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashPassword
        });

        await user.save();

        // Access token
        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // Refresh token
        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Hash refresh token
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // Save session
        await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email
            },
            accessToken
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Access token
        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // Refresh token
        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Hash refresh token
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // Save session
        await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // Store refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email
            },
            accessToken
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


// =========================
// REFRESH TOKEN
// =========================

router.get("/refresh-token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: "Refresh token is not found"
            });
        }

        // Verify old refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        );

        // Hash old refresh token
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // Find active session
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                error: "Invalid refresh token"
            });
        }

        // Revoke old session
        session.revoked = true;
        await session.save();

        // Create new refresh token
        const newRefreshToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Hash new refresh token
        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");

        // Create new session
        await sessionModel.create({
            user: decoded.userId,
            refreshTokenHash: newRefreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // New access token
        const accessToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // New refresh cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(401).json({
            error: "Invalid or expired refresh token"
        });
    }
});


// =========================
// LOGOUT CURRENT DEVICE
// =========================

router.get("/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        // Hash refresh token
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // Find active session
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(400).json({
                error: "Invalid refresh token"
            });
        }

        // Revoke session
        session.revoked = true;
        await session.save();

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


// =========================
// LOGOUT FROM ALL DEVICES
// =========================

router.get(
    "/logout-all",
    authMiddleware,
    async (req, res) => {
        try {

            // Revoke all active sessions
            await sessionModel.updateMany(
                {
                    user: req.userId,
                    revoked: false
                },
                {
                    $set: {
                        revoked: true
                    }
                }
            );

            // Clear current device cookie
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });

            return res.status(200).json({
                message: "Logged out from all devices successfully"
            });

        } catch (error) {
            console.error("Logout all error:", error);

            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


export default router;