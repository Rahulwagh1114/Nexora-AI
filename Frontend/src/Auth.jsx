import { useState,useContext } from "react";
import { MyContext } from "./MyContext";
import "./Auth.css";



function Auth() {
    const { setIsAuthenticated,pendingPage, setPendingPage, setCurrentPage } = useContext(MyContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? "login" : "register";
        const body = isLogin ? { email, password } : { name, email, password };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(body),
                });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Something went wrong");
                return;
            }

            //backend acces token bhejan
            localStorage.setItem(
                "accessToken", data.accessToken
            );

            localStorage.setItem(

                "user",
                JSON.stringify(data.user)
            );

            setIsAuthenticated(true);

            setCurrentPage(pendingPage || "chat");
            setPendingPage(null)

        } catch (err) {
            console.error("Auth error:", err);
            alert("Server error. Please try again.");
        }

    }

    return (
        <div className="authPage" >
            <h2>{isLogin ? "Login to Nexora-AI" : "Create Account"}</h2>

            <form onSubmit={handleSubmit}>
                {!isLogin && (<input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />)}

                <input type="text" placeholder="example@gamail.com" value={email} onChange={(e) => setEmail(e.target.value)} />

                <input type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" >{isLogin ? "Login" : "Register"}</button>
                <p> {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span  onClick={() => setIsLogin(!isLogin)} > {isLogin ? " Register" : " Login"} </span>
                </p>

            </form>
        </div>
    )
}
export default Auth;
