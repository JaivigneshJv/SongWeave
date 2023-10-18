import React, { useState } from "react";
import axios from "axios";
import "./player.css";

function Right(props) {
  const [songFile, setSongFile] = useState(null);

  const handleSongFileChange = (event) => {
    setSongFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("song", songFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.reload();

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="right_container ">
      <div className="songs_container">
        <h2>Songs</h2>
        <ul>
          {props.songs.map((song) => (
            <li key={song._id}>
              <div className="song_item">
                <div className="song_info">
                  <h3>{song.title}</h3>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="upload_container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="song">Song: </label>
            <input type="file" id="song" onChange={handleSongFileChange} />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Right;
