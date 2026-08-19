import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Groq client setup (OpenAI-compatible, text/coding queries ke liye)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Gemini client setup (multimodal, image/PDF queries ke liye)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Internal helper — Groq ke liye (export nahi kiya, bahar se accessible nahi)
async function askGroq(message) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: message }],
  });
  return completion.choices[0].message.content;
}

// Internal helper — Gemini ke liye (export nahi kiya, bahar se accessible nahi)
async function askGemini(message, file) {
  const result = await geminiModel.generateContent([
    message,
    { inlineData: { data: file.base64Data, mimeType: file.mimeType } },
  ]);
  return result.response.text();
}

/**
 * Sirf yehi ek function export hota hai.
 * File hai ya nahi, ye khud check karke Groq ya Gemini ko route kar deta hai.
 * @param {string} message
 * @param {{ base64Data: string, mimeType: string } | null} file
 * @returns {Promise<string>}
 */
export async function getAIResponse(message, file = null) {
  if (file) {
    return askGemini(message, file);
  }
  return askGroq(message);
}