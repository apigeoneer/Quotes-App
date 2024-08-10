import { useContext } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToHomePage, setRedirectToHomePage] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();  /* to prevent redirection from the page - default behavior of html */
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-type': 'application/json'},
            credentials: 'include',   // to include any cookies in our browser
        });
        if (response.ok) {
            // login succesful & redirect to homepage
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirectToHomePage(true);
            })
        } else {
            alert("Login failed. Wrong credentials.");
        }
    }

    if(redirectToHomePage) {
        return <Navigate to={'/'} />
    }

    return(
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" 
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}/>
            <button>Login</button>
        </form>
    );
}