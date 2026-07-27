import "./TitleComponent.css";
function TitleComponent({src,createNewChat}){
    return(
        <section className="titleSection">
            <span className="title"> <img src={src} className="logo" alt="Nexora-Ai-icon"/> Nexora-AI</span>
           
           <div className="additionalOption">
         <button onClick={createNewChat}>
                <span> <i className="fa-solid fa-pen-to-square"></i> New Chat</span>
              </button>
               <span className="span2"><i className="fa-solid fa-wand-magic-sparkles"></i> Studio</span>
                <span className="span2"><i className="fa-solid fa-chart-column"></i> Insights</span>
         </div>
         <div className="recentsDiv">
            <span >Recents</span>
            <i className="fa-solid fa-sliders"></i>
         </div>
              </section>
    )
}
export default TitleComponent;