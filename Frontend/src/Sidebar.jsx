import nexoraIcon from "./assets/nexora-icon.svg";
import './Sidebar.css';
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TitleComponent from "./TitleComponent";


function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
  const getAllThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`);
      const res = await response.json();
      const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }))
      setAllThreads(filteredData)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null)
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`)
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
   <div className="mainSidebar">
     <TitleComponent src={nexoraIcon} createNewChat={createNewChat} />
    <section className='sidebar'>
      <ul className="history">
        {
          allThreads?.map((thread, idx) => (
            <li key={idx} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : ""} >{thread.title} <i className="fa-solid fa-trash" onClick={(e) => {
              e.stopPropagation();
              deleteThread(thread.threadId)
            }}></i></li>
          ))
        }
      </ul>

      {/* <div className="sign">
        <p>By rahul wagh</p>
      </div> */}
    </section>
      </div>
  )
}

export default Sidebar;