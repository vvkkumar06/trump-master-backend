/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const db = require('./../data/db');
const playersData = require('./../assets/cricket/players/stats/cricket-players');
const { transformToCardData }  = require('./../helpers/transform');


router.get('/collection', (req, res) =>{ 
  res.json(transformToCardData(db, playersData))
});

router.patch('/collection/add', (req, res) =>{ 
  let idx = db.backupCards.findIndex(i => i == req.body.id);
   db.backupCards.splice(idx,1);  
   db.playingCards[req.body.vacantPlayerId] = req.body.id;
   res.json({success: true})
})

router.patch('/collection/remove', (req, res) =>{ 
  db.playingCards[req.body.vacantPlayerId] = undefined;
  db.backupCards.push(req.body.id)   
  res.json({success: true})
})


module.exports = router;