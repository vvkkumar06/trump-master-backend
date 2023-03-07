/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const db = require('./../data/db');
const playersData = require('./../assets/cricket/players/stats/cricket-players');
const { transformToCardData }  = require('./../helpers/transform');


router.get('/collection', (req, res) =>{ 
  res.json(transformToCardData(db, playersData))
})

module.exports = router;