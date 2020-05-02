const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
  AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: 'Incorrect username or password ',
        });
      }
      // AuthService.comparePasswords(loginUser.password, dbUser.password);
      if (loginUser.password !== dbUser.password) {
        return res.status(400).json({
          error: 'Incorrect username or password',
        });
      }

      const sub = dbUser.user_name;
      const payload = { user_id: dbUser.id };
      const userId = dbUser.id;
      res.send({
        authToken: AuthService.createJwt(sub, payload),
        userId,
      });
    })
    .catch(next);
});
authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = { id: req.user.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});
module.exports = authRouter;
