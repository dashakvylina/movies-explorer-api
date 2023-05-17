const router = require('express').Router();
const MoviesRouter = require('./movies');
const UserRouter = require('./users');

router.use(MoviesRouter);
router.use(UserRouter);
module.exports = router;
