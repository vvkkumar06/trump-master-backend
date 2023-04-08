/**
 * Route Path - /cricket/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const { authenticateJWT } = require('./../middlewares/authenticate-jwt');
const { getUser } = require('./../services/user-service');
const { getCricketStats } = require('./../services/firebase/initialize');


router.get('/collection', authenticateJWT,  async (req, res) => { 
  const user = await getUser(req.user.id);
  const cricketCollection = user.games.cricket;
  res.json(cricketCollection)
});


router.get('/stats', async(req, res) =>{ 
  const stats = await getCricketStats();
  res.json(stats)
});


module.exports = router;