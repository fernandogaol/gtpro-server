const xss = require('xss');

const ProjectsService = {
  projectExists(db, title) {
    return db
      .from('gtpro_projects')
      .where({ title })
      .first()
      .then((title) => !!title);
  },
  getAllProjects(db) {
    return db.from('gtpro_projects').select('*');
  },

  getProjectById(db, id) {
    return ProjectsService.getAllProjects(db).where({ id }).first();
  },
  getProjectByUserId(db, user_id) {
    return ProjectsService.getAllProjects(db).where({ user_id });
  },
  insertProject(db, newProject) {
    return db
      .insert(newProject)
      .into('gtpro_projects')
      .returning('*')
      .then(([project]) => project);
  },
  deleteProject(db, id) {
    return db.from('gtpro_projects').where({ id }).delete();
  },
  updateProject(db, id, newProjectFields) {
    return db.from('gtpro_projects').where({ id }).update(newProjectFields);
  },
  serializeProject(project) {
    return {
      id: project.id,
      user_id: project.user_id,
      title: xss(project.title),
      date_created: new Date(project.date_created),
    };
  },
};

module.exports = ProjectsService;
