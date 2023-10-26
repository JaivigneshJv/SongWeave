import express from "express";
import mongoose from "mongoose";
import Song from "./models/Song.js";
import { parseFile } from "music-metadata";
import { inspect } from "util";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import * as fs from "fs";
dotenv.config();
import { Downloader } from 'ytdl-mp3';
import YouTube from "youtube-sr";


const downloader = new Downloader({
  outputDir: "./assets",
  getTags: true,
});


const app = express();
const PORT = process.env.PORT || 3001;
//nodemon gidyai

app.use(cors());
app.use(express.json());



import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET,
});

try {
  //gidyai
  mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (err) {
  console.log(err);
}


//for my purpose - ignore
app.post("/api/uploadsongs", async (req, res) => {
  try {
    const { user, title, img_src, album, src } = req.body;

    const song = new Song({
      user,
      songs: [
        {
          title,
          img_src,
          album,
          src,
        },
      ],
    });

    await song.save();

    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//send all the songs to client

app.get("/api/songs", async (req, res) => {
  try {
    const { user } = req.query;
    const songs = await Song.find({ user });
    res.status(200).json(songs[0].songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.user;
    cb(null, `./assets/`);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "audio/mpeg") {
      return cb(new Error("Only MP3 files are allowed"));
    }

    cb(null, true);
  },
});


//Upload songs
app.post("/api/upload", upload.single("song"), (req, res) => {
  try {
    const { path: filePath } = req.file;
    const user = req.query.user;

    (async () => {
      try {
        const metadata = await parseFile(filePath);
        const pictureData = metadata.common.picture[0].data;
        const pictureFileName = uuidv4() + ".jpg";
        const pictureFilePath = "./assets/" + pictureFileName;

        fs.writeFileSync("./assets/" + pictureFileName, pictureData);
        let cloudpicture;
        let cloudsong;
        
        cloudinary.uploader.upload(
          pictureFilePath,
          { resource_type: "image", public_id: pictureFileName },
          function (error, result) {
            const cloudpicture = result.secure_url;
            
            cloudinary.uploader.upload(
              filePath,
              { resource_type: "auto", public_id: path.basename(filePath) },
              function (error, result) {
                
                const cloudsong = result.secure_url;

                const filter = { user: user };
                const song = {
                  title: metadata.common.title,
                  img_src: cloudpicture,
                  album: metadata.common.album,
                  src: cloudsong,
                  user: user,
                };
                
                Song.findOneAndUpdate(
                  filter,
                  { $push: { songs: song } },
                  { new: true }
                )
                  .then(() => {
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(pictureFilePath);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            );
          }
        );
      } catch (error) {
        console.error(error.message);
      }
    })();
    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



//New Userr

app.post("/api/newuser", async (req, res) => {
    try {
    const { username } = req.body;
    const existingUser = await Song.findOne({ user: username });
    if (existingUser) {
      res.status(200).send("User already exists");
    } else {
      const user = new Song({ user: username });
      await user.save();
      res.status(201).send("User created successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


//Delete song

app.post("/api/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const song = await Song.findOneAndUpdate(
      { "songs._id": id },
      { $pull: { songs: { _id: id } } },
      { new: true }
    );
    if (!song) {
      res.status(400).send("Song not found");
    } else {
      res.status(200).send("Song deleted successfully");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/searchupload", async (req, res) => {
  const { search } = req.body;
  const videos = await YouTube.search(search, { limit: 1 });
  const downloader = new Downloader({
    outputDir: "./assets",
    getTags: true,
});
await downloader.downloadSong(videos[0].url);



})

app.post("/api/searchforsongs", async (req, res) => {
  const {search} = req.body;
  console.log(search)
  const videos = await YouTube.search(search, { limit: 3 });
  res.status(200).json(videos);
});

app.post("/api/searchsongupload", async (req, res) => {
  const {url} = req.body;
  const user = req.query.user;
  (async () => {
    try {
      let filepath_search = "";
      try {
         filepath_search = await downloader.downloadSong(url);
        // rest of the code
      } catch (error) {
        console.error(error.message);
        fs.readdir("assets", (err, files) => {
          if (err) throw err;
          for (const file of files) {
            fs.unlink(path.join("assets", file), (err) => {
              if (err) throw err;
            });
          }
        });
      }
      const metadata = await parseFile(filepath_search);
      const pictureData = metadata.common.picture[0].data;
      const pictureFileName = uuidv4() + ".jpg";
      const pictureFilePath = "./assets/" + pictureFileName;

      fs.writeFileSync("./assets/" + pictureFileName, pictureData);

      let cloudpicture;
      let cloudsong;
      
      cloudinary.uploader.upload(
        pictureFilePath,
        { resource_type: "image", public_id: pictureFileName },
        function (error, result) {
          const cloudpicture = result.secure_url;
          
          cloudinary.uploader.upload(
            filepath_search,
            { resource_type: "auto", public_id: path.basename(filepath_search) },
            function (error, result) {
              
              const cloudsong = result.secure_url;

              const filter = { user: user };
              const song = {
                title: metadata.common.title,
                img_src: cloudpicture,
                album: metadata.common.album,
                src: cloudsong,
                user: user,
              };
              
              Song.findOneAndUpdate(
                filter,
                { $push: { songs: song } },
                { new: true }
              )
                .then(() => {
                  fs.unlinkSync(filepath_search);
                  fs.unlinkSync(pictureFilePath);
                })
                .catch((err) => {
                  console.log(err);
                  fs.unlinkSync(filepath_search);
                });
            }
          );
        }
      );
      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Can't get data! Try again");
    }
  })();
  
});

app.listen(PORT, () => {
  //gidyai
  console.log(`Server is running on port ${PORT}`);
});
