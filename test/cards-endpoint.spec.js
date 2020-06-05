const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Cards Endpoint', function () {
  let db;

  const {
    testUsers,
    testProjects,
    testLists,
    testCards,
  } = helpers.makeFixtures();

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

  describe(`POST /api/cards`, () => {
    context(`Card Validation`, () => {
      beforeEach('Insert users', () => {
        return db.into('gtpro_users').insert(testUsers);
      });
      beforeEach('Insert projects', () => {
        return db.into('gtpro_projects').insert(testProjects);
      });
      beforeEach('Insert lists', () => {
        return db.into('gtpro_lists').insert(testLists);
      });

      beforeEach('Insert cards', () => {
        return db.into('gtpro_cards').insert(testCards);
      });

      const requiredFields = ['content', 'list_id'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          content: 'test content',
          list_id: 'test list_id',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/cards')
            .send(registerAttemptBody)
            .expect(400, {
              error: { message: `${field} is required` },
            });
        });

        context(`Happy path`, () => {
          it(`responds 201, serialized list`, () => {
            const testCard = testCards[0];
            const newCard = {
              content: 'test content',
              list_id: testCard.list_id,
            };
            return supertest(app)
              .post('/api/cards')
              .send(newCard)
              .expect(201)
              .expect((res) => {
                expect(res.body).to.have.property('id');
                expect(res.body.content).to.eql(newCard.content);
                expect(res.body.list_id).to.eql(newCard.list_id);
                expect(res.headers.location).to.eql(
                  `/api/cards/${res.body.id}`
                );
                const expectedDate = new Date().toLocaleString();
                const actualDate = new Date(
                  res.body.date_created
                ).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
              })
              .expect((res) =>
                db
                  .from('gtpro_cards')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then((row) => {
                    expect(row.content).to.eql(newCard.content);
                    expect(row.list_id).to.eql(newCard.list_id);
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
    describe(`GET /api/cards`, () => {
      context(`Given no lists`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app).get('/api/cards').expect(200, []);
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
