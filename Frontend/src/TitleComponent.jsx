import "./TitleComponent.css";
function TitleComponent({createNewChat}){
    return(
        <section className="titleSection">
            <span className="title"> <i className="fa-brands fa-nfc-symbol"></i> Nexora-AI</span>
           
           <div className="additionalOption">
         <button onClick={createNewChat}>
                <span> <i className="fa-solid fa-pen-to-square"></i> New Chat</span>
              </button>
               <span className="span2"><i className="fa-solid fa-wand-magic-sparkles"></i> Studio</span>
                <span className="span2"><i className="fa-solid fa-chart-column"></i> Insights</span>
         </div>
         <div id="recentsDiv">
            <span >Recents</span>
            <i className="fa-solid fa-sliders"></i>
         </div>
              </section>
    )
}
export default TitleComponent;