import express from "express";
import mongoose from "mongoose";
import Song from "./models/Song.js";
import { parseFile } from "music-metadata";
import { inspect } from "util";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

//gidyai
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3001;
//nodemon gidyai 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/Neko/Developer/MediaPlayerMERN/client/public/songs");
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

app.use(cors());

try { //gidyai
  mongoose.connect("mongodb://localhost:27017/songs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (err) {
  console.log(err);
}

app.use(express.json());

app.post("/api/uploadsongs", async (req, res) => {
  try {
    const { title, img_src, album, src } = req.body;

    const song = new Song({
      title,
      img_src,
      album,
      src,
    });

    await song.save();

    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find();

    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/upload", upload.single("song"), (req, res) => {
  try {
    const { path: filePath } = req.file;
    
    (async () => {
      try {

        const metadata = await parseFile(filePath);
        const pictureData = metadata.common.picture[0].data;
        const pictureFileName = uuidv4() + ".jpg";
        const pictureFilePath = path.join("","public", "images", pictureFileName);
        console.log(pictureFilePath)
        fs.writeFileSync("/Users/Neko/Developer/MediaPlayerMERN/client/public/images/"+pictureFileName, pictureData);

        // console.log(inspect(metadata, { showHidden: false, depth: null }));
        // console.log(metadata.common.title);
        // console.log(metadata.common.artist);
        // console.log(metadata.common.picture[0].data);

        const song = new Song({
          title: metadata.common.title,
          img_src : "./images/" + pictureFileName,
          album: metadata.common.album,
          src : "./songs/" + path.basename(filePath),
        });
        await song.save();

        // console.log("../../backend/" + path.dirname(pictureFilePath) + "/" + pictureFileName)
        // console.log("../../backend/" + filePath)
        // console.log()

      } catch (error) {
        console.error(error.message);
      }
    })();

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// (async () => {
//     try {
//       const metadata = await parseFile('../client/public/songs/Eeriye-MassTamilan.dev.mp3');
//       console.log(inspect(metadata, { showHidden: false, depth: null }));
//       console.log(metadata.common.title);
//       console.log(metadata.common.artist);
//       console.log(metadata.common.picture[0].data);

//     } catch (error) {
//       console.error(error.message);
//     }
//   })();

app.listen(PORT, () => { //gidyai
  console.log(`Server is running on port ${PORT}`);
});
