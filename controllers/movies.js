const Movies = require('../models/movies');
const {
  OK_CODE,
} = require('../constants');
const {
  BadRequestError,
  DefaultError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

const getMovies = async (req, res, next) => {
  try {
    const result = await Movies.find();
    // const result = await Movies.find().populate(['owner likes']);
    res.status(OK_CODE).json(result);
  } catch (error) {
    next(new DefaultError('Unknown error'));
  }
};

const createMovies = async (req, res, next) => {
  try {
    const { body, user } = req;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
    } = body;
    const newMovie = new Movies({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      owner: user._id,
    });
    await newMovie.save();
    res.status(OK_CODE).json(newMovie);
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Validator error'));
    } else {
      next(error);
    }
  }
};

const deleteMovies = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { user } = req;
    const result = await Movies.findOne({ _id: movieId });
    if (result === null) {
      throw new NotFoundError('Card not found');
    } else if (!result.owner.equals(user._id)) {
      throw new ForbiddenError('only author can delete a card');
    } else {
      const remRes = await result.remove();
      res.status(OK_CODE).json(remRes);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Card id is not valid'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getMovies, createMovies, deleteMovies,
};
