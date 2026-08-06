import './App.css'
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import Studio from './Studio';
import Insights from './Insights';
import Auth from "./Auth";


function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState(null);
  const [currThreadId,setCurrThreadId]=useState(uuidv4())
  const [prevChats,setPrevChats]=useState([])//stores all chat of aor curr thred
  const [newChat,setNewChat]=useState(true); 
  const [allThreads,setAllThreads]=useState([]);
  const [searchQuery, setSearchQuery]=useState("")
  const [currentPage,setCurrentPage]=useState("studio")
  const [pendingPage,setPendingPage]=useState(null)
   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"))

  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
    searchQuery,setSearchQuery,
    currentPage,setCurrentPage,
    isAuthenticated,setIsAuthenticated,
    pendingPage,setPendingPage
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar/>
        {currentPage==="chat"? <ChatWindow/>:
        currentPage==="insights"? <Insights/>:
        currentPage==="auth"?<Auth/>:
        <Studio/>
        }
        </MyContext.Provider>
    </div>
  )
}

export default App
