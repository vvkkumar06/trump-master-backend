/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const playersData = require('./../assets/cricket/players/stats/cricket-players');
const {transformGalleryCardStateToList, transformTeamCardsStateToList} = require('./../helpers/transform');
const collection = {
  1: {
    count: 5
  },
  5: {
    count: 1
  },
  7: {
    count: 2
  },
  112: {
    count: 2
  },
  115: {
    count: 1
  },
  199: {
    count: 1
  },
  203: {
    count: 4
  },
  15: {
    count: 1
  },
  4: {
    count: 2
  }
};

const team = {
  player1: 123,
  player2: 0,
  player3: 0,
  player4: 0,
  player5: 154
};


router.get('/collection', (req, res) =>{ 
  res.json(transformGalleryCardStateToList(collection, playersData))
})
router.get('/team', (req, res) =>{ 
  res.json(transformTeamCardsStateToList(team, playersData))
})
module.exports = router;