const app = require('../src/app');
const helpers = require('./test-helpers');
const knex = require('knex');

describe.only('Users Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeUsersArray();
  //   const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('clean the table', () => db('gtpro_users').truncate());

  afterEach('cleanup', () => db('gtpro_users').truncate());

  describe(`GET /api/users/`, () => {
    context('Given there are NO users', () => {
      it('Responds with 200 and an empty array list', () => {
        return supertest(app).get('/api/bookmarks/').expect(200, []);
      });
    });
    // context('Given there are users in the database', () => {
    //   const testUsers = helpers.makeUsersArray();

    //   beforeEach('insert bookmarks', () => {
    //     return db.into('bookmark_list').insert(testUsers);
    //   });

    //   it('responds with 200 and all of the bookmarks', () => {
    //     return supertest(app)
    //       .get('/api/bookmarks/')
    //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //       .expect(200, testUsers);
    //   });
    // });
  });
});
