import nexoraIcon from "./assets/nexora-icon.svg";
import './Sidebar.css';

function Sidebar(){
    return(
        <section className='sidebar'>
          <button>
            <img src={nexoraIcon} className="logo" alt="Nexora-Ai-icon" />
           <span> <i className="fa-solid fa-pen-to-square"></i></span>
          </button>

          <ul className="history">
            <li>history</li>
             <li>history</li>
              <li>history</li>
          </ul>

          <div className="sign">
            <p>By rahul wagh</p>
          </div>
        </section>
    )
}

export default Sidebar;