import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);

    async function register(ev) {
        ev.preventDefault();  /* to prevent redirection from the page - default behavior of html */
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-type': 'application/json'},
        })
        if (response.status === 200) {
            // alert("Registration successful. You're signed in now.");
            setRedirectToLoginPage(true);
        } else {
            alert("Registration failed.");
        }
    }

    if(redirectToLoginPage) {
        return <Navigate to={'/login'} />
    }


    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}/>
            <button>Register</button>
        </form>
    );
}