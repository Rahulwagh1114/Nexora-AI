import './ChatWindow.css';
import Chat from './Chat';
import { MyContext } from './MyContext';
import { useContext, useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);


    const getReply = async () => {
        setLoading(true);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        }

        try {
            const response = await fetch("http://localhost:5000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
            console.log(response);

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

            <div className='navbar'>
                <span>Nexora-AI <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv">
                    <span className='userIcon'><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat />
            <ScaleLoader color="#ffffff" loading={loading} />

            <div className='chatInput'>
                <div className="inputBox">
                    <input type="text" placeholder="Ask anything" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? getReply() : ""} ></input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className='info'>
                    Nexora-AI can make mistakes. Checks important info. See cookie Preferences.
                </p>
            </div>
        </div>

    )
}
export default ChatWindow;