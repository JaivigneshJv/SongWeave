const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: String,
  audioUrl: {
    type: String,
    required: true,
  },
  imageUrl: String, // Cloudinary URL for album cover image
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
