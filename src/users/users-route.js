const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const logger = require('../logger');
// needs API KEY set
//passwords need to be hashed
//authorization and authentication needs to be added

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route('/').get((req, res, next) => {
  UsersService.getAllUsers(req.app.get('db'))
    .then(users => {
      res.json(users.map(UsersService.serializeUser));
    })
    .catch(next);
});

usersRouter
  .route('/:user_id')
  .all(checkUserExists)
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete((req, res, next) => {
    const { user_id } = req.params;
    UsersService.deleteUser(req.app.get('db'), user_id)
      .then(user => {
        logger.info('user was deleted');
        res.status(204).end();
      })
      .catch(next);
  });

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name } = req.body;
  const passwordError = UsersService.validatePassword(password);

  for (const field of ['full_name', 'user_name', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get('db'), user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already exists` });

      // return UsersService.hashPassword(password)
      //   .then(hashedPassword => {
      //     // PASSWORDS STILL NEED TO BE HASHED
      //     const newUser = {
      //       user_name,
      //       password,
      //       full_name,
      //       date_created: 'now()'
      // };

      return UsersService.insertUser(req.app.get('db'), newUser).then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(UsersService.serializeUser(user));
      });
    })

    .catch(next);
});

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getUserById(
      req.app.get('db'),
      req.params.user_id
    );

    if (!user) {
      logger.error(`user doesn't exist`);
      return res.status(404).json({
        error: `user doesn't exist`
      });
    }
    res.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = usersRouter;
