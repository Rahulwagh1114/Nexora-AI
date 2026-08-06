import "./TitleComponent.css";
import { MyContext } from "./MyContext";
import { useContext } from "react";

function TitleComponent({createNewChat}){
    const {setCurrentPage,isAuthenticated,setPendingPage}=useContext(MyContext);

    //new chat
    const handleNewChat=()=>{
        if(!isAuthenticated){
            setPendingPage("chat")
            setCurrentPage("auth");
            return;
        }
        setCurrentPage("chat");
        createNewChat();
    }

    //Insights

const handleInsights=()=>{
    if(!isAuthenticated){
        setPendingPage("insights")
        setCurrentPage("auth");
        return;
    }
    setCurrentPage("insights");
}

  //studio

  const handleStudio=()=>{
    setCurrentPage("studio")
  }

    return(
        <section className="titleSection">
            <span className="title"> <i className="fa-brands fa-nfc-symbol"></i> Nexora-AI</span>
           
           <div className="additionalOption">
         <button onClick={handleNewChat}>
                <span> <i className="fa-solid fa-pen-to-square"></i> New Chat</span>
              </button>
               <span className="span2" onClick={handleStudio}><i className="fa-solid fa-wand-magic-sparkles"></i> Studio</span>
                <span className="span2" onClick={handleInsights}><i className="fa-solid fa-chart-column"></i> Insights</span>
         </div>
         <div id="recentsDiv">
            <span >Recents</span>
            <i className="fa-solid fa-sliders"></i>
         </div>
              </section>
    )
}
export default TitleComponent;