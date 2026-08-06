import './ChatWindow.css';
import Chat from './Chat';
import { MyContext } from './MyContext';
import { useContext, useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import Navbar from './Navbar';
import { authFetch } from './api';

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, newChat, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        const accessToken = localStorage.getItem("accessToken");
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
        const response = await authFetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        });
        if (!response) { setLoading(false); return; }
        const res = await response.json();
        setReply(res.reply);
    } catch (err) {
        console.log(err);
    }
    setLoading(false)
}

    useEffect(() => {
        if (prompt, reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "Assistant",
                    content: reply
                }
                ]
            ))
        }
        setPrompt("");
    }, [reply]);

    return (
        <div className='chatWindow'>
            <Navbar/>

            <div className={`chatBody ${newChat ? "centerMode" : ""}`}>
                <Chat />
                <ScaleLoader color="#fff" loading={loading} />

                <div className='chatInput'>
                    <div className="inputBox">
                        <input id="promptInput" type="text" placeholder="Ask anything" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? getReply() : ""} ></input>
                        <div id='plus'><i className="fa-solid fa-plus"></i></div>
                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                        <div id="mike"><i className="fa-solid fa-microphone"></i></div>
                    </div>
                    <p className='info'>
                        Nexora-AI can make mistakes. Checks important info. See cookie Preferences.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default ChatWindow;