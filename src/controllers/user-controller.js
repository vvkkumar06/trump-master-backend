/**
 * Route Path - /api/user/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const { authenticateJWT } = require('./../middlewares/authenticate-jwt');
const { getUser, updateUserCricketState } = require('./../services/user-service');


router.get('/', authenticateJWT,  async (req, res) => { 
  const user = await getUser(req.user.id);
  res.json(user)
});

router.put('/cricket', authenticateJWT,  async (req, res) => { 
  await updateUserCricketState(req.user.id, req.body);
  res.json({message: 'game state updated'});
});


module.exports = router;