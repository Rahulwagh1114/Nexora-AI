import "./TitleComponent.css";
function TitleComponent({src,createNewChat}){
    return(
        <section className="titleSection">
            <span className="title"> <img src={src} className="logo" alt="Nexora-Ai-icon"/> Nexora-AI</span>
           
           <div className="additionalOption">
         <button onClick={createNewChat}>
                <span> <i className="fa-solid fa-pen-to-square"></i> New Chat</span>
              </button>
               <span><i className="fa-solid fa-wand-magic-sparkles"></i> Studio</span>
                <span><i className="fa-solid fa-chart-column"></i> Insights</span>
         </div>
              </section>
    )
}
export default TitleComponent;