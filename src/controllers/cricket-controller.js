/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const db = require('./../data/db');
const playersData = require('./../assets/cricket/players/stats/cricket-players');


router.get('/collection', (req, res) =>{ 
  res.json(db())
});


router.get('/stats', (req, res) =>{ 
  res.json(playersData)
});

router.get('/stats/:ClientPlayerID', (req, res) =>{ 
  let data = playersData.find(player => player.ClientPlayerID === req.params.ClientPlayerID);
  res.json(data)
});

module.exports = router;