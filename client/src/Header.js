import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);  // Clear the user info to update the UI
      // window.location.href = '/login';  // Redirect to login page after logout
    });
  }

  const username = userInfo?.username;

  return (
      <header>
        <div className="logo-container">
          <Link to="/" className="logo">Safarnama</Link>
        </div>
        <nav>
          {username && (
            <>
              <Link to="/create">Create</Link>
              <Link onClick={logout}>Logout</Link>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>   
            </>
          )}
        </nav>
      </header>
  );
}