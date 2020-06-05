const express = require('express');
const ProjectsService = require('./projects-service');
const logger = require('../logger');
const bodyParser = express.json();
const projectsRouter = express.Router();

projectsRouter
  .route('/')
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
      .then((projects) => {
        res.json(projects.map(ProjectsService.serializeProject));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, user_id } = req.body;
    const newProject = { title, user_id };

    for (const field of ['title', 'user_id']) {
      if (!newProject[field]) {
        logger.error(`${field} is required`);
        return res
          .status(400)
          .send({ error: { message: `${field} is required` } });
      }
    }
    ProjectsService.insertProject(req.app.get('db'), newProject)
      .then((project) => {
        logger.info(`new project created with id number ${project.id}`);
        res
          .status(201)
          .location(`/api/projects/${project.id}`)
          .json(ProjectsService.serializeProject(project));
      })
      .catch(next);
  });

projectsRouter
  .route('/:project_id')
  .all(checkProjectExists)
  .get((req, res) => {
    res.json(ProjectsService.serializeProject(res.project));
  })
  .delete((req, res, next) => {
    const { project_id } = req.params;
    ProjectsService.deleteProject(req.app.get('db'), project_id)
      .then((projectDeleted) => {
        logger.info('project was deleted');
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, user_id } = req.body;
    const projectToUpdate = { title, user_id };

    const numberOfValues = Object.values(projectToUpdate).filter(Boolean)
      .length;

    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must contain 'title' and 'user_id`,
        },
      });
    }
    ProjectsService.updateProject(
      req.app.get('db'),
      req.params.project_id,
      projectToUpdate
    )
      .then((projetUpdate) => {
        logger.info('project was updated');
        res.status(204).end();
      })
      .catch(next);
  });

projectsRouter
  .route('/user/:user_id')
  .all(checkUserProjectExists)
  .get((req, res, next) => {
    const { user_id } = req.params;
    ProjectsService.getProjectByUserId(req.app.get('db'), user_id)
      .then((project) => {
        res.json(project);
      })
      .catch(next);
  });

async function checkUserProjectExists(req, res, next) {
  try {
    const project = await ProjectsService.getProjectByUserId(
      req.app.get('db'),
      req.params.user_id
    );

    if (!project)
      return res.status(404).json({
        error: `project doesn't exist`,
      });

    res.project = project;
    next();
  } catch (error) {
    next(error);
  }
}
async function checkProjectExists(req, res, next) {
  try {
    const project = await ProjectsService.getProjectById(
      req.app.get('db'),
      req.params.project_id
    );

    if (!project)
      return res.status(404).json({
        error: `project doesn't exist`,
      });

    res.project = project;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = projectsRouter;
