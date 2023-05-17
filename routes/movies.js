const router = require('express').Router();
const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');
const { postMoviesValidate, deleteMoviesValidate } = require('../validation');

router.get('/movies', getMovies);

router.post('/movies', postMoviesValidate, createMovies);

router.delete(
  '/movies/:movieId',
  deleteMoviesValidate,
  deleteMovies,
);

module.exports = router;
