const knex = require('knex');
// const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Projects Endpoint', function () {
  let db;

  const { testProjects } = helpers.makeFixtures();
  const testProject = testProjects[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  // before('cleanup', () => helpers.cleanTables(db));

  // afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/projects`, () => {
    context(`Project Validation`, () => {
      beforeEach('insert projects', () => {
        return db.into('gtpro_projects').insert(testProjects);
      });

      const requiredFields = ['title', 'user_id'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          title: 'test title',
          user_id: 'test 1',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/projects')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      // describe(`GET /api/projects`, () => {
      //   context(`Given no projects`, () => {
      //     it(`responds with 200 and an empty list`, () => {
      //       return supertest(app).get('/api/projects').expect(200, []);
      //     });
      //   });

      //   context('Given there are projects in the database', () => {
      //     beforeEach('insert projects', () =>
      //       db.into('gtpro_projects').insert(testProjects)
      //     );
      //   });
      // context(`Happy path`, () => {
      //   it(`responds 201, serialized user`, () => {
      //     const newUser = {
      //       user_name: 'test username',
      //       full_name: 'test full_name',
      //       password: '11bbaaaaaA',
      //     };
      //     return supertest(app)
      //       .post('/api/users')
      //       .send(newUser)
      //       .expect(201)
      //       .expect((res) => {
      //         expect(res.body).to.have.property('id');
      //         expect(res.body.user_name).to.eql(newUser.user_name);
      //         expect(res.body.full_name).to.eql(newUser.full_name);
      //         expect(res.body).to.not.have.property('password');
      //         expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
      //       })
      //       .expect((res) =>
      //         db
      //           .from('gtpro_projects')
      //           .select('*')
      //           .where({ id: res.body.id })
      //           .first()
      //           .then((row) => {
      //             expect(row.user_name).to.eql(newUser.user_name);
      //             expect(row.full_name).to.eql(newUser.full_name);
      //             return newUser.password === row.password;
      //           })
      //           .then((compareMatch) => {
      //             expect(compareMatch).to.be.true;
      //           })
      //       );
      //   });
      // });
    });
  });
});
