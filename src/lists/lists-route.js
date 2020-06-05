const express = require('express');
const ListsService = require('./lists-service');
const logger = require('../logger');
const bodyParser = express.json();
const listsRouter = express.Router();

listsRouter
  .route('/')
  .get((req, res, next) => {
    ListsService.getAllLists(req.app.get('db'))
      .then((lists) => {
        res.json(lists.map(ListsService.serializeList));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, project_id } = req.body;
    const newList = { title, project_id };

    for (const field of ['title', 'project_id']) {
      if (!newList[field]) {
        logger.error(`${field} is required`);
        return res
          .status(400)
          .send({ error: { message: `${field} is required` } });
      }
    }

    return ListsService.insertList(req.app.get('db'), newList).then((list) => {
      logger.info(`new list created with id number ${list.id}`);
      res
        .status(201)
        .location(`/api/lists/${list.id}`)
        .json(ListsService.serializeList(list));
      // .send(project);
    });
  });

listsRouter
  .route('/:list_id')
  .all(checkListExists)
  .get((req, res) => {
    res.json(ListsService.serializeList(res.list));
  })
  .delete((req, res, next) => {
    const { list_id } = req.params;
    ListsService.deleteList(req.app.get('db'), list_id)
      .then((listDeleted) => {
        logger.info('list was deleted');
        res.status(204).end();
      })
      .catch(next);
  })
  //PATCH METHOD WILL BE USED IN THE FUTURE
  .patch(bodyParser, (req, res, next) => {
    const { title, project_id } = req.body;
    const listToUpdate = { title, project_id };

    const numberOfValues = Object.values(listToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must contain 'title' and 'project_id`,
        },
      });
    }

    ListsService.updateList(req.app.get('db'), req.params.list_id, listToUpdate)
      .then((listUpdate) => {
        logger.info('list was updated');
        res.status(204).end();
      })
      .catch(next);
  });

listsRouter.route('/project/:project_id').get((req, res, next) => {
  const { project_id } = req.params;
  ListsService.getListByProjectId(req.app.get('db'), project_id)
    .then((list) => {
      res.json(list);
    })
    .catch(next);
});

async function checkListExists(req, res, next) {
  try {
    const list = await ListsService.getListById(
      req.app.get('db'),
      req.params.list_id
    );

    if (!list)
      return res.status(404).json({
        error: `list doesn't exist`,
      });

    res.list = list;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = listsRouter;
