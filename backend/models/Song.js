const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  user: {
    type: String,

  },
  songs: [{
    title: {
      type: String,
      
    },
    img_src: {
      type: String,
      
    },
    album: String,
    src: {
      type: String,
      
    }
  }]
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;