import React from "react";
import "./login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const Login = () => {
  const nav = useNavigate();
  useEffect(() => {
    const checkUsername = () => {
      const username = localStorage.getItem("username");
      if (username) {
        nav("/" + username);
      }
    };

    checkUsername();
  }, [nav]);
  const [Username, setUsername] = useState("");
  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(process.env.REACT_APP_SERVERLINK+"/api/newuser", {
        username: Username,
      });
    } catch (err) {
      console.log(err);
    }
    localStorage.setItem("username", Username);
    nav("/" + Username);
  };
  return (
    <div className="App">
      <div className="login_continer">
        <input
          type="text"
          placeholder="enter playlist name"
          value={Username}
          on
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Open</button>
      </div>
    </div>
  );
};

export default Login;
