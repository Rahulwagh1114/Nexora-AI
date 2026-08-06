import RobotMascot from './RobotMascot';
import './studio.css';
import StudioCard from './StudioCard';
import Navbar from './Navbar';
function Studio() {
    return (
    
         <div className='studioDiv'>
           <Navbar/>
          <div className='studio'><div>
            
              <RobotMascot/>
            </div>
            <div className='cardBox'>
                <StudioCard icon={"fa-solid fa-file"} title="Document Intelligence" desc="Read, question, and distill any file in seconds." lists={["PDF, DOCX & PPT chat", "OCR on scans", "Table extraction", "Auto summaries & notes"]} />
           
                 
                <StudioCard icon={"fa-solid fa-file"} title="Visual Reasoning" desc="Show it an image, get back understanding." lists={["Object detection", "Diagram explanation", "Image description", "OCR from photos"]} />
          
                <StudioCard icon={"fa-solid fa-file"} title="Coding Companion" desc="From first draft to production, in one thread." lists={["Generate & explain code", "Bug finder", "Language conversion", "Regex & SQL"]} />
          
                <StudioCard icon={"fa-solid fa-file"} title="Voice & Language" desc="Speak naturally, write flawlessly, in any tongue." lists={["Voice conversation", "Speech to text", "Translation", "Grammar polish"]} />
           
                <StudioCard icon={"fa-solid fa-file"} title="Smart Chat Threads" desc="Keep your conversations organized and easy to manage." lists={["Create new threads", "Switch between chats", "Delete conversations", "Manage chat history"]} />
           
                <StudioCard icon={"fa-solid fa-file"} title="Multi-Model AI" desc="Experience powerful AI responses through multiple AI models." lists={["Gemini integration", "Groq integration", "Fast AI inference", "Flexible model support"]} />
            </div>
            </div>
            </div>
    
    )
}
export default Studio;