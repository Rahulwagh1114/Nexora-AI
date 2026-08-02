import './StudioCard.css';
function StudioCard({icon,title,desc,lists}){
    return(
         <>
         <div className='card'>
           <div className='iconsDiv'>
            <i className={icon}></i>
           </div>
           <h4 className='title'>{title}</h4>
           <p className='desc'>{desc}</p>
           <ul>
              {lists.map((list,idx)=>
                   <li className='listItem' key={idx}>{list}</li>  )}
           </ul>
         </div>
         </>
    )

}
export default StudioCard;