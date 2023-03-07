/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const playersData = require('./../assets/cricket/players/stats/cricket-players');


router.get('/players', (req, res) =>{ 
  res.json(playersData)
})


module.exports = router;