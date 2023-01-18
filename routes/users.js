const router = require('express').Router();
const { getMe, updateUser } = require('../controllers/users');
const { patchUserValidatate } = require('../validation');

router.get('/users/me', getMe);

router.patch(
  '/users/me',
  patchUserValidatate,
  updateUser,
);

module.exports = router;
