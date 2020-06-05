const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Lists Endpoint', function () {
  let db;

  const { testLists, testProjects, testUsers } = helpers.makeFixtures();

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

  describe(`POST /api/lists`, () => {
    context(`List Validation`, () => {
      beforeEach('Insert users', () => {
        return db.into('gtpro_users').insert(testUsers);
      });
      beforeEach('Insert projects', () => {
        return db.into('gtpro_projects').insert(testProjects);
      });
      beforeEach('Insert lists', () => {
        return db.into('gtpro_lists').insert(testLists);
      });

      const requiredFields = ['title', 'project_id'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          title: 'test title',
          project_id: 'test project_id',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/lists')
            .send(registerAttemptBody)
            .expect(400, {
              error: { message: `${field} is required` },
            });
        });

        context(`Happy path`, () => {
          it(`responds 201, serialized list`, () => {
            const testList = testLists[0];
            const testUser = testUsers[0];
            const newList = {
              title: 'test title',
              project_id: testList.project_id,
            };
            return supertest(app)
              .post('/api/lists')
              .send(newList)
              .expect(201)
              .expect((res) => {
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.eql(newList.title);
                expect(res.body.project_id).to.eql(newList.project_id);
                expect(res.headers.location).to.eql(
                  `/api/lists/${res.body.id}`
                );
                const expectedDate = new Date().toLocaleString();
                const actualDate = new Date(
                  res.body.date_created
                ).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
              })
              .expect((res) =>
                db
                  .from('gtpro_lists')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then((row) => {
                    expect(row.title).to.eql(newList.title);
                    expect(row.project_id).to.eql(newList.project_id);
                    const expectedDate = new Date().toLocaleString();
                    const actualDate = new Date(
                      row.date_created
                    ).toLocaleString();
                    expect(actualDate).to.eql(expectedDate);
                  })
              );
          });
        });
      });
    });
    describe(`GET /api/lists`, () => {
      context(`Given no lists`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app).get('/api/lists').expect(200, []);
        });
      });

      context('Given there are lists in the database', () => {
        beforeEach('Insert lists', () =>
          db.into('gtpro_lists').insert(testLists)
        );
      });
    });
  });
});
