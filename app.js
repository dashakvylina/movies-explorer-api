const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { Joi, celebrate, Segments } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const MoviesRouter = require('./routes/movies');
const UserRouter = require('./routes/users');
const { createUser, login, signOut } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundError } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  autoIndex: true,
});

const corsOptions = {
  // credentials: true,
  // origin: 'https://domainname.students.dasha.nomoredomains.club',
  // origin: 'http://localhost:3000',
  // origin(origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

// app.use(logger);

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
}), login);

app.get('/signout', signOut);

// app.use(celebrate({
//   [Segments.HEADERS]: Joi.object({
//     authorization: Joi.string().required().regex(/Bearer\s[a-z0-9._-]*/i),
//   }).unknown(),
// }));
app.use('/', auth, UserRouter);
app.use('/', auth, MoviesRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует!'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'Unknown error' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log('Server is running');
});
