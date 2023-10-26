import React from "react";
import "./player.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Songs = (props) => {
  const uploadsong = async (url) => {
    try {
      await axios
        .post(
          `https://musicappbackend.azurewebsites.net/api/searchsongupload?user=${localStorage.getItem(
            "username"
          )}`,
          {
            url: url,
          }
        )
        .then((res) => {
          console.log(res);
          toast.success("Upload successfull, redirecting.. ", {
            position: "bottom-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        });
    } catch (err) {
      console.log(err);
      toast.error("We can't get your song", {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const { songs } = props;

  return (
    <div className="songs_searcher">
      {songs.map((song) => (
        <div className=" songs_searchsongs" key={song.id}>
          {song.title}
          <button
            onClick={() => {
              uploadsong(song.url);
            }}
          >
            Upload
          </button>
        </div>
      ))}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeButton={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Songs;
