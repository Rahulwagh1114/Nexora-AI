import nexoraIcon from "./assets/nexora-icon.svg";
import './Sidebar.css';
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";


function Sidebar(){
  const {allThreads,setAllThreads,currThreadId}=useContext(MyContext);
  const getAllThreads=async()=>{
    try{
      const response=await fetch("http://localhost:5000/api/thread");
      const res= await response.json();
      const filteredData=res.map(thread=>({threadId:thread.threadId, title:thread.title}))
      setAllThreads(filteredData)
    }catch(err){
      console.log(err);
    }
  }

   useEffect(()=>{
    getAllThreads();
   },[currThreadId]);

    return(
        <section className='sidebar'>
          <button>
            <img src={nexoraIcon} className="logo" alt="Nexora-Ai-icon" />
           <span> <i className="fa-solid fa-pen-to-square"></i></span>
          </button>

          <ul className="history">
           {
            allThreads?.map((thread,idx)=>(
              <li key={idx}>{thread.title}</li>
            ))
           }
          </ul>

          <div className="sign">
            <p>By rahul wagh</p>
          </div>
        </section>
    )
}

export default Sidebar;