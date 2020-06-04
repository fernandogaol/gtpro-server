// const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'Password1',
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: '2029-01-22T16:28:37.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'Password2',
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: '2029-01-22T16:28:37.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'Password3',
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: '2029-01-22T16:28:37.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'Password4',
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: '2029-01-22T16:28:37.615Z',
    },
  ];
}
function makeProjectsArray() {
  return [
    {
      id: 1,
      title: 'test1',
      user_id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      title: 'test2',
      user_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      title: 'test3',
      user_id: 3,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      title: 'test4',
      user_id: 4,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testProjects = makeProjectsArray();

  return { testUsers, testProjects };
}
//WILL BE UTILIZED IN THE FUTURE

// function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
//   const token = jwt.sign({ user_id: user.id }, secret, {
//     subject: user.user_name,
//     algorithm: 'HS256',
//   });
//   return `Bearer ${token}`;
// }

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      gtpro_users,
      gtpro_projects,
      gtpro_lists,
      gtpro_cards
      RESTART IDENTITY CASCADE`
  );
}
//WILL BE UTILIZED IN THE FUTURE

// function seedUsers(db, users) {
//   //   const preppedUsers = users.map((user) => ({
//   //     ...user,
//   //     password: bcrypt.hashSync(user.password, 1),
//   //   }));

//   return db
//     .insert(users)
//     .into('itav_users')
//     .returning('*')
//     .then(([user]) => user);
// }

module.exports = {
  makeUsersArray,
  makeFixtures,
  cleanTables,
  // makeAuthHeader,
};
