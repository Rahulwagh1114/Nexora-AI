# Nexora-AI

A full-stack AI chat platform built from the ground up — think ChatGPT, but with its own authentication, database, dual AI-model routing, and analytics layer built in-house.

**Live Demo:** [https://nexora-ai-khaki-omega.vercel.app](https://nexora-ai-khaki-omega.vercel.app)

---

## Overview

Nexora-AI lets users chat with AI models in real time, with each user's conversation history securely isolated and persisted. Instead of relying on a single AI provider, the backend intelligently routes each request to the model best suited for it — fast text/code generation through Groq, and multimodal image/document understanding through Gemini.

## Features

- **Dual AI-model routing** — text and coding queries are routed to Groq (low-latency inference); image and PDF queries are routed to Gemini (multimodal understanding)
- **JWT authentication** — access + refresh token flow, with each user's chat threads scoped and isolated at the database level
- **Real-time streaming responses** — Markdown rendering with syntax-highlighted code blocks
- **Persistent chat threads** — create, switch between, search, and delete conversations
- **Usage analytics dashboard** — chat counts, daily/monthly activity, token usage estimates, and topic breakdown, computed from real thread data
- **Fully responsive UI** — clean experience across desktop and mobile

## Tech Stack

**Frontend**
- React (Vite)
- Context API for state management
- React Markdown + rehype-highlight for formatted, syntax-highlighted responses

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

**AI Integration**
- Groq API (text/coding queries)
- Gemini API (image/PDF queries)

**Deployment**
- Frontend — Vercel
- Backend — Render

## Architecture

```
Client (React)
   │
   │  Authorization: Bearer <accessToken>
   ▼
Express API
   │
   ├── /api/auth      → register, login, logout, token refresh
   │
   └── /api/*  (protected by authMiddleware)
         ├── /thread    → CRUD for chat threads, scoped by userId
         └── /chat      → routes message to Groq or Gemini based on payload
                              │
                              ├── text only        → Groq API
                              └── image/PDF attached → Gemini API
```

Every thread document is linked to a `userId`, so all reads and writes are scoped to the authenticated user — no cross-user data leakage is possible at the query level.

## Project Structure

```
nexora-ai/
├── backend/
│   ├── models/          # User, Thread, Session (Mongoose schemas)
│   ├── routes/          # auth.js, chat.js
│   ├── middleware/      # JWT auth middleware
│   ├── utils/           # AI client routing (Groq / Gemini)
│   └── server.js
└── frontend/
    └── src/
        ├── Sidebar.jsx      # Thread list, search, navigation
        ├── ChatWindow.jsx   # Chat input and message flow
        ├── Chat.jsx         # Message rendering with Markdown/code
        ├── Auth.jsx         # Login / Register
        ├── Studio.jsx       # Feature showcase page
        └── Insights.jsx     # Usage analytics dashboard
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string
- Groq API key
- Gemini API key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

```bash
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Authenticate and receive tokens | No |
| GET | `/api/auth/logout` | Invalidate session | Yes |
| GET | `/api/thread` | Fetch all threads for the logged-in user | Yes |
| GET | `/api/thread/:threadId` | Fetch messages for a specific thread | Yes |
| DELETE | `/api/thread/:threadId` | Delete a thread | Yes |
| POST | `/api/chat` | Send a message, get an AI response | Yes |

## License

This project is open for learning and reference purposes.

## Author

Built by Rahul Wagh
