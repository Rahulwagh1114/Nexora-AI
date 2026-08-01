import './Chat.css';
import { MyContext } from './MyContext';
import { useContext, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";//react-markdown pakg for fromating
import rehypeHighlight from "rehype-highlight"; //rehype-highlight pakg for highlighting
import remarkBreaks from "remark-breaks";  
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null)
            return;
        }
        if (!prevChats?.length) return;   //last chat jo ab ki latest ho us kelieye typing effect
        const content = reply.split(" ")  //indivial word
        let idx = 0
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40)
        return () => clearInterval(interval);
    }, [prevChats, reply]);


    return (
        <>
            {newChat && <p style={{fontSize:"25px"}}>Ready when you are.</p>}
            <div className='chats'>
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "openAiDiv"} key={idx}>
                            {
                                chat.role === "user" ? <p className='userMessage'>{chat.content}</p> :
                                    <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }

                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (<div className='openAiDiv' key={"non-typing"}>
                                    <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                </div>) :
                                    <div className='openAiDiv' key={"typing"}>
                                        <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                            }

                            

                        </>
                    )
                }


            </div>
        </>
    )
}

export default Chat;