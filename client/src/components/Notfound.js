import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const nav = useNavigate();
  setTimeout(() => {
    nav("/");
  }, 5000);

  return (
    <div className="App">
      <h1>Playlist Not Found</h1>
      <h2> redirecting....</h2>
    </div>
  );
};

export default Notfound;
