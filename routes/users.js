const router = require('express').Router();
const { Joi, celebrate, Segments } = require('celebrate');
const { getMe, updateUser } = require('../controllers/users');

router.get('/users/me', getMe);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),

  }),
}), updateUser);

module.exports = router;
