const express = require('express');
const ListsService = require('./lists-service');
const logger = require('../logger');
const bodyParser = express.json();
// const { requireAuth } = require('../middleware/jwt-auth');
// needs API KEY set

const listsRouter = express.Router();

listsRouter.route('/').get((req, res, next) => {
  ListsService.getAllLists(req.app.get('db'))
    .then(lists => {
      res.json(lists.map(ListsService.serializeList));
    })
    .catch(next);
});
//   .post(bodyParser, (req, res, next) => {
//     const { title, user_id } = req.body;
//     const newlist = { title, user_id };

//     for (const field of ['title', 'user_id']) {
//       if (!newProject[field]) {
//         logger.error(`${field} is required`);
//         return res
//           .status(400)
//           .send({ error: { message: `${field} is required` } });
//       }
//     }
//     ProjectsService.insertProject(req.app.get('db'), newProject).then(
//       project => {
//         logger.info(`new project created with id number ${project.id}`);
//         res
//           .status(201)
//           .location(`/api/projects/${project.id}`)
//           .json(ProjectsService.serializedProject(project));
//         // .send(project);
//       }
//     );
//   });

listsRouter
  .route('/:list_id')
  .all(checkListExists)
  .get((req, res) => {
    res.json(ListsService.serializeList(res.list));
  })
  .delete((req, res, next) => {
    const { list_id } = req.params;
    ListsService.deleteList(req.app.get('db'), list_id)
      .then(listDeleted => {
        logger.info('list was deleted');
        res.status(204).end();
      })
      .catch(next);
  });
//   .patch(bodyParser, (req, res, next) => {
//     const { title, user_id } = req.body;
//     const projectToUpdate = { title, user_id };

//     const numberOfValues = Object.values(projectToUpdate).filter(Boolean)
//       .length;

//     if (numberOfValues === 0) {
//       logger.error(`Invalid update without required fields`);
//       return res.status(400).json({
//         error: {
//           message: `Request body must contain 'title' and 'user_id`
//         }
//       });
//     }
//     ProjectsService.updateProject(
//       req.app.get('db'),
//       req.params.project_id,
//       projectToUpdate
//     )
//       .then(projetUpdate => {
//         logger.info('project was updated');
//         res.status(204).end();
//       })
//       .catch(next);
//   });

async function checkListExists(req, res, next) {
  try {
    const list = await ListsService.getListById(
      req.app.get('db'),
      req.params.list_id
    );

    if (!list)
      return res.status(404).json({
        error: `list doesn't exist`
      });

    res.list = list;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = listsRouter;
