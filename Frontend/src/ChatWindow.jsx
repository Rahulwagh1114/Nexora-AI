import './ChatWindow.css';
import Chat from './Chat';
function ChatWindow(){
    return(
        
        <div className='chatWindow'>

            <div className='navbar'>
                <span>Nexora-AI <i class="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv">
                    <span className='userIcon'><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat/>

            <div className='chatInput'>
               <div className="inputBox">
                <input type="text" placeholder="Ask anything"></input>
                <div id="submit"><i className="fa-solid fa-paper-plane"></i></div>
               </div>
               <p className='info'>
                Nexora-AI can make mistakes. Checks important info. See cookie Preferences.
               </p>
            </div>
        </div>
        
    )
}
export default ChatWindow;