import nexoraIcon from "./assets/nexora-icon.svg";
import './Sidebar.css';
import { MyContext } from "./MyContext";
import { useContext, useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import TitleComponent from "./TitleComponent";


function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, searchQuery } = useContext(MyContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

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

  // NAYA — outside click detect karke sidebar band karega
  useEffect(() => {
    function handleClickOutside(e) {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const filteredThreads = allThreads?.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hamburger — sirf tab dikhega jab sidebar band ho */}
      {!isSidebarOpen && (
        <div className="hamburgerBtn" onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      )}

      <div className={`mainSidebar ${isSidebarOpen ? "open" : ""}`} ref={sidebarRef}>
        {/* Close (X) — sirf mobile view mein dikhega, CSS se control hoga */}
        <div className="closeBtn" onClick={() => setIsSidebarOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>

        <TitleComponent createNewChat={createNewChat} />
        <section className='sidebar'>

          <ul className="history">
            {
              filteredThreads?.map((thread, idx) => (
                <li key={idx} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : ""} >{thread.title} <i className="fa-solid fa-trash" onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId)
                }}></i></li>
              ))
            }
          </ul>

        </section>
      </div>
    </>
  )
}

export default Sidebar;