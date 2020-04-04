const xss = require('xss');
// const Treeize = require('treeize');

const CardsService = {
  cardExists(db, content) {
    return db
      .from('gtpro_cards')
      .where({ content })
      .first()
      .then(content => !!content);
  },
  getAllCards(db) {
    return db.from('gtpro_cards').select('*');
  },

  getCardById(db, id) {
    return CardsService.getAllCards(db)
      .where({ id })
      .first();
  },
  getCardByListId(db, list_id) {
    return CardsService.getAllCards(db).where({ list_id });
  },
  insertCard(db, newCard) {
    return db
      .insert(newCard)
      .into('gtpro_cards')
      .returning('*')
      .then(([card]) => card);
  },
  deleteCard(db, id) {
    return db
      .from('gtpro_cards')
      .where({ id })
      .delete();
  },
  updateCard(db, id, newCardFields) {
    return db
      .from('gtpro_cards')
      .where({ id })
      .update(newCardFields);
  },
  serializeCard(card) {
    return {
      id: card.id,
      list_id: card.list_id,
      content: xss(card.content),
      date_created: new Date(card.date_created)
    };
  }
};

module.exports = CardsService;
