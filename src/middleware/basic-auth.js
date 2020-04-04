function requireAuth(req, res, next) {
  const AuthService = require('../auth/auth-service');
  const authToken = req.get('Authorization') || '';
  if (!authToken.toLowerCase().startsWith('basic')) {
    return res.status(401).json({ error: 'missing basic token' });
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length);
  }

  const [tokenUserName, tokenPassword] = Buffer.from(basicToken, 'base64')
    .toString()
    .split(':');

  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request 1' });
  }

  req.app
    .get('db')('thingful_users')
    .where({ user_name: tokenUserName })
    .first()
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request 2' });
      }
      return AuthService.comparePasswords(tokenPassword, user.password).then(
        passwordsMatch => {
          if (!passwordsMatch) {
            return res.status(401).json({ error: 'Unauthorized request 3' });
          }
          req.user = user;
          next();
        }
      );
    })
    .catch(next);
}

module.exports = {
  requireAuth
};
