const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('gtpro_users').where({ user_name }).first();
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
  parseBasicToken(token) {
    return Buffer.from(token, 'base64').toString().split(':');
  },
};
module.exports = AuthService;
