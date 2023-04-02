/**
 * Route Path - /api/user/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const { authenticateJWT } = require('./../middlewares/authenticate-jwt');
const { getUser } = require('./../services/user-service');


router.get('/', authenticateJWT,  async (req, res) => { 
  const user = await getUser(req.user.id);
  res.json(user)
});

module.exports = router;