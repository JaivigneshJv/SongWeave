import "./App.css";
import React, { useState, useEffect } from "react";
import Player from "./components/Player";
import Right from "./components/Right";
//gidyai - file structure
import axios from "axios";



function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0); //gidyai - hooks
  const [nextSongIndex, setNextSongIndex] = useState(0);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await axios.get("http://localhost:3001/api/songs");
        setSongs(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchSongs();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      setNextSongIndex(() => {
        if (currentSongIndex + 1 > songs.length - 1) {
          return 0;
        } else {
          return currentSongIndex + 1;
        }
      });
    }
  }, [currentSongIndex, songs]);

  return (
    <div className="App">
      {songs.length > 0 && (
        <Player
          currentSongIndex={currentSongIndex} //gidyai - props
          setCurrentSongIndex={setCurrentSongIndex}
          nextSongIndex={nextSongIndex}
          songs={songs}
        />
      )}
      <Right
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        nextSongIndex={nextSongIndex}
        songs={songs}
      />
    </div>
  );
}

export default App;
