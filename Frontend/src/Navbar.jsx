import "./Navbar.css";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";

function Navbar() {
    const { isAuthenticated, setIsAuthenticated, setCurrentPage, searchQuery, setSearchQuery } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.error || data.message || "Failed to Logout");
                return;
            }

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setIsOpen(false);
        } catch (err) {
            console.error("Logout error:", err);
            alert("Server error. Please try again.");
        }
    }
                    
    return (
        <>
            <div className='navbar'>
                <div><span className="navTitle">AI Workspace for Developers<i className="fa-solid fa-angle-down"></i></span><p>One AI Platform. Endless Possibilities.</p></div>

                <div className='searchInputDiv'>
                    <i className="fa-solid fa-magnifying-glass searchIcon"></i>
                    <input id="searchInput" placeholder='Search chat' value={searchQuery} onChange={handleSearch}></input>
                </div>

                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className='userIcon'><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {
                isOpen &&
                <div className='dropDown'>
                    <div className='dropDownItem'><i className="fa-solid fa-gear"></i>Setting</div>
                    <div className='dropDownItem'><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
                    {isAuthenticated ? (
                        <div className='dropDownItem' onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i>LogOut
                        </div>
                    ) : (
                        <div className='dropDownItem' onClick={() => { setCurrentPage("auth"); setIsOpen(false); }}>
                            <i className="fa-solid fa-angles-left"></i>Login
                        </div>
                    )}
                </div>
            }
        </>
    )
}

export default Navbar;