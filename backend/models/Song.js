const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img_src: {
    type: String,
    required: true,
  },
  album: String,
  src: {
    type: String,
    required: true,
  }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

//gidyai