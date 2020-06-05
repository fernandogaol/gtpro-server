const xss = require('xss');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]/;

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db
      .from('gtpro_users')
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
  getAllUsers(db) {
    return db.from('gtpro_users').select('*');
  },
  getUserById(db, id) {
    return UsersService.getAllUsers(db).where({ id }).first();
  },
  getUserByUserName(db, user_name) {
    return UsersService.getAllUsers(db).where({ user_name }).first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('gtpro_users')
      .returning('*')
      .then(([user]) => user);
  },
  deleteUser(db, id) {
    return db.from('gtpro_users').where({ id }).delete();
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain least one upper case and one number';
    }
    return null;
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;
