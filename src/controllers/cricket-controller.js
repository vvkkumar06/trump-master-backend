/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const _ = require('lodash');
// const db = require('./../data/db');
const playersData = require('./../assets/cricket/players/stats/cricket-players');
const { authenticateJWT } = require('./../middlewares/authenticate-jwt');
const { getUser } = require('./../services/user-service');


router.get('/collection', authenticateJWT,  async (req, res) => { 
  const user = await getUser(req.user.id);
  const cricketCollection = user.games.cricket;
  res.json(cricketCollection)
});


router.get('/stats', (req, res) =>{ 
  res.json(playersData)
});

router.get('/stats/:ClientPlayerID', (req, res) =>{ 
  let data = playersData.find(player => player.ClientPlayerID === req.params.ClientPlayerID);
  res.json(data)
});

module.exports = router;