const xss = require('xss');
// const Treeize = require('treeize');

const ListsService = {
  listExists(db, title) {
    return db
      .from('gtpro_lists')
      .where({ title })
      .first()
      .then((title) => !!title);
  },
  getAllLists(db) {
    return db.from('gtpro_lists').select('*');
  },

  getListById(db, id) {
    return ListsService.getAllLists(db).where({ id }).first();
  },

  getListByProjectId(db, project_id) {
    return ListsService.getAllLists(db).where({ project_id });
  },
  insertList(db, newList) {
    return db
      .insert(newList)
      .into('gtpro_lists')
      .returning('*')
      .then(([list]) => list);
  },
  deleteList(db, id) {
    return db.from('gtpro_lists').where({ id }).delete();
  },
  updateList(db, id, newListFields) {
    return db.from('gtpro_lists').where({ id }).update(newListFields);
  },
  serializeList(list) {
    return {
      id: list.id,
      project_id: list.project_id,
      title: xss(list.title),
      date_created: new Date(list.date_created),
    };
  },
};

module.exports = ListsService;
