const knex = require('knex');
// const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Projects Endpoint', function () {
  let db;

  const { testProjects, testUsers } = helpers.makeFixtures();
  const testProject = testProjects[0];
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/projects`, () => {
    context(`Project Validation`, () => {
      beforeEach('insert users', () => {
        return db.into('gtpro_users').insert(testUsers);
      });
      beforeEach('insert projects', () => {
        return db.into('gtpro_projects').insert(testProjects);
      });

      const requiredFields = ['title', 'user_id'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          title: 'test title',
          user_id: 'test user_id',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/projects')
            .send(registerAttemptBody)
            .expect(400, {
              error: { message: `${field} is required` },
            });
        });
        context(`Happy path`, () => {
          it(`responds 201, serialized project`, () => {
            const newProject = {
              title: 'test title',
              user_id: testProjects.user_id,
            };
            return supertest(app)
              .post('/api/projects')
              .send(newProject)
              .expect(201)
              .expect((res) => {
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.eql(newProject.title);
                expect(res.body.user_id).to.eql(newProject.user_id);
                expect(res.headers.location).to.eql(
                  `/api/projects/${res.body.id}`
                );
              })
              .expect((res) =>
                db
                  .from('gtpro_projects')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then((row) => {
                    expect(row.title).to.eql(newProject.title);
                    expect(row.user_id).to.eql(newProject.user_id);
                  })
                  .then((compareMatch) => {
                    expect(compareMatch).to.be.true;
                  })
              );
          });
        });
      });
    });
    describe(`GET /api/projects`, () => {
      context(`Given no projects`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app).get('/api/projects').expect(200, []);
        });
      });

      context('Given there are projects in the database', () => {
        beforeEach('insert projects', () =>
          db.into('gtpro_projects').insert(testProjects)
        );
      });
    });
  });
});
