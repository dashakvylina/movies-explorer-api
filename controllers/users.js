const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { OK_CODE } = require('../constants');
const {
  BadRequestError,
  DefaultError,
  NotFoundError,
  // UnauthorizedError,
  ConflictError,
} = require('../errors');

const getMe = async (req, res, next) => {
  try {
    const { user } = req;

    const result = await User.findById(user._id);
    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    console.log({ error });

    if (error.name === 'CastError') {
      next(new BadRequestError('Unknown error'));
    } else {
      next(error);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const {
      email, name,
    } = body;
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = new User({
      email, password: hash, name,
    });
    await newUser.save();
    const { password, ...data } = newUser._doc;
    res.status(OK_CODE).json(data);
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError('Email exists'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError('Data is not vallid'));
    } else {
      next(new DefaultError('Unknown error'));
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, email },
      { new: true, runValidators: true },
    );
    if (result === null) {
      throw new NotFoundError('user not found');
    } else {
      res.status(OK_CODE).json(result);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(('Name or about are not vallid')));
    } else if (error.name === 'CastError') {
      next(new BadRequestError(('Invalid id')));
    } else {
      next(new DefaultError(('Unknown error')));
    }
  }
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'devSecretKey', { expiresIn: '7d' });
      res.cookie(
        'token',
        token,
        {
          maxAge: 360000000,
          httpOnly: true,
          // sameSite: true
        },
      ).send({});
    })
    .catch(next);
};

const signOut = (req, res) => {
  const token = jwt.sign({ _id: null }, process.env.JWT_SECRET || 'devSecretKey', { expiresIn: '7d' });
  res.cookie(
    'token',
    token,
    {
      maxAge: 360000000,
      httpOnly: true,
      // sameSite: true
    },
  ).send({});
};

module.exports = {
  getMe, updateUser, signOut, createUser, login,
};
