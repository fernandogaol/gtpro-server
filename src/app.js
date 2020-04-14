require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
const usersRouter = require('../src/users/users-route');
const projectsRouter = require('../src/projects/projects-route');
const listsRouter = require('../src/lists/lists-route');
const cardsRouter = require('../src/cards/cards-route');
const authRouter = require('../src/auth/auth-router');

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/lists', listsRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the GT Pro API!');
});
app.use(function errorHandler(error, req, res, next) {
  console.error(error);
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});
module.exports = app;
