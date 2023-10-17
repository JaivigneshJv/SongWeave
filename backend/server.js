const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Song = require('./models/Song');


const app = express();
const PORT = process.env.PORT || 3001;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret',
});

try{
    mongoose.connect('mongodb://localhost:27017/songs', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}catch(err){
    console.log(err);
}

app.use(express.json());

// Set up file upload using Multer for both song and image
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API route to upload a song and an image
app.post('/api/upload-song', upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
    // Extract metadata from the uploaded MP3 file
    const metadata = await musicMetadata.parseBuffer(req.files.song[0].buffer);

    // Upload the song to Cloudinary
    const songCloudinaryResponse = await cloudinary.uploader.upload_stream(
        (stream) => stream.pipe(req.files.song[0].stream),
        { resource_type: 'video' }
    );

    // Upload the image to Cloudinary if available
    let imageCloudinaryResponse = null;
    if (req.files.image) {
        imageCloudinaryResponse = await cloudinary.uploader.upload_stream(
        (stream) => stream.pipe(req.files.image[0].stream),
        { resource_type: 'image' }
        );
    }

    const song = new Song({
        title: req.body.title || metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        url: songCloudinaryResponse.secure_url,
        image: imageCloudinaryResponse ? imageCloudinaryResponse.secure_url : null,
    });

    await song.save();

    res.status(201).json({ message: 'Song and image uploaded successfully' });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
