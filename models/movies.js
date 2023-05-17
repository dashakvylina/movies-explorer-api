const { mongoose } = require('mongoose');
const validator = require('validator');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validator: (v) => validator.isURL(v),
  },
  trailerLink: {
    type: String,
    required: true,
    validator: (v) => validator.isURL(v),
  },
  thumbnail: {
    type: String,
    required: true,
    validator: (v) => validator.isURL(v),
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    // required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  apiId: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('movie', moviesSchema);
