const express = require('express');
const CardsService = require('./cards-service');
const logger = require('../logger');
const bodyParser = express.json();
// const { requireAuth } = require('../middleware/jwt-auth');
// needs API KEY set

const cardsRouter = express.Router();

cardsRouter
  .route('/')
  .get((req, res, next) => {
    CardsService.getAllCards(req.app.get('db'))
      .then((cards) => {
        res.json(cards.map(CardsService.serializeCard));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { content, list_id } = req.body;
    const newCard = { content, list_id };

    for (const field of ['content', 'list_id']) {
      if (!newCard[field]) {
        logger.error(`${field} is required`);
        return res
          .status(400)
          .send({ error: { message: `${field} is required` } });
      }
    }

    // CardsService.cardExists(req.app.get('db'), content).then((cardExists) => {
    //   if (cardExists)
    //     return res.status(400).json({ error: `card name already exists` });

    return CardsService.insertCard(req.app.get('db'), newCard).then((card) => {
      logger.info(`new project created with id number ${card.id}`);
      res
        .status(201)
        .location(`/api/cards/${card.id}`)
        .json(CardsService.serializeCard(card));
    });
  });
// });

cardsRouter
  .route('/:card_id')
  .all(checkCardExists)
  .get((req, res) => {
    res.json(CardsService.serializeCard(res.card));
  })
  .delete((req, res, next) => {
    const { card_id } = req.params;
    CardsService.deleteCard(req.app.get('db'), card_id)
      .then((cardDeleted) => {
        logger.info('card was deleted');
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { content, list_id } = req.body;
    const cardToUpdate = { content, list_id };

    const numberOfValues = Object.values(cardToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must contain 'content' and 'list_id`,
        },
      });
    }

    CardsService.cardExists(req.app.get('db'), content).then((cardExists) => {
      if (cardExists)
        return res.status(400).json({ error: `card name already exists` });

      CardsService.updateCard(
        req.app.get('db'),
        req.params.card_id,
        cardToUpdate
      )
        .then((cardUpdate) => {
          logger.info('card was updated');
          res.status(204).end();
        })
        .catch(next);
    });
  });
cardsRouter.route('/list/:list_id').get((req, res, next) => {
  const { list_id } = req.params;
  CardsService.getCardByListId(req.app.get('db'), list_id)
    .then((card) => {
      res.json(card);
    })
    .catch(next);
});

async function checkCardExists(req, res, next) {
  try {
    const card = await CardsService.getCardById(
      req.app.get('db'),
      req.params.card_id
    );

    if (!card)
      return res.status(404).json({
        error: `card doesn't exist`,
      });

    res.card = card;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = cardsRouter;
