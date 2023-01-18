const { Joi, celebrate, Segments } = require('celebrate');

const postMoviesValidate = (req, res, next) => {
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().regex(/https?:\/\/([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/i).required(),
      trailerLink: Joi.string().regex(/https?:\/\/([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/i).required(),
      thumbnail: Joi.string().regex(/https?:\/\/([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/i).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      link: Joi.string().regex(/https?:\/\/([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/i).required(),
    }),
  });
  next();
};
const deleteMoviesValidate = (req, res, next) => {
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  });
  next();
};

const patchUserValidatate = (req, res, next) => {
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),

    }),
  });
  next();
};

module.exports = { postMoviesValidate, deleteMoviesValidate, patchUserValidatate };
