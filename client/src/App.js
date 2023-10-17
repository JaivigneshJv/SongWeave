import "./App.css";
import React, { useState, useEffect } from "react";
import Player from "./components/Player";

function App() {
  const [songs] = useState([
    {
      title: "Eeriye",
      img_src: "./images/eeriye-tamil-2023.jpeg",
      src: "./songs/Eeriye-MassTamilan.dev.mp3",
    },
    {
      title: "Anbenum",
      img_src: "./images/leo-tamil-2023-anbenum.jpeg",
      src: "./songs/Anbenum-MassTamilan.dev.mp3",
    },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [nextSongIndex, setNextSongIndex] = useState(0);

  useEffect(() => {
    setNextSongIndex(() => {
      if (currentSongIndex + 1 > songs.length - 1) {
        return 0;
      } else {
        return currentSongIndex + 1;
      }
    });
  }, [currentSongIndex, songs.length]);

  return (
    <div className="App">
      <Player
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        nextSongIndex={nextSongIndex}
        songs={songs}
      />
    </div>
  );
}

export default App;
