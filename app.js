require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { Joi, celebrate, Segments } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Routes = require('./routes');
const { createUser, login, signOut } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundError, commonError } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
const { NOT_FOUND_ERROR_TEXT } = require('./constants');
const { MONGODB_URL } = require('./config');

const {
  PORT = 3000, DB_NAME = 'bitfilmsdb', DB_URL, NODE_ENV,
} = process.env;

const dbUrl = NODE_ENV === 'production' ? DB_URL : MONGODB_URL;

const app = express();

app.use(helmet());
app.use(limiter);

mongoose.connect(`${dbUrl}/${DB_NAME}`, {
  autoIndex: true,
});

// const corsOptions = {
//   credentials: true,
// origin: 'https://api.domainname.students.dasha.nomoredomains.club',
// origin: 'http://localhost:3000',
// origin(origin, callback) {
//   if (whitelist.indexOf(origin) !== -1) {
//     callback(null, true);
//   } else {
//     callback(new Error('Not allowed by CORS'));
//   }
// },
// };

app.use(cors());

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

app.use('/', auth, Routes);

app.use(auth, (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_TEXT));
});

app.use(errorLogger);

app.use(errors());

app.use(commonError);

app.listen(PORT, () => {
  console.log('Server is running');
});
