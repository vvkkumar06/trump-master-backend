/**
 * Route Path - /api/auth/** 
*/

const router = require('express').Router();
const _ = require('lodash');
const { createUserIfNotExists} = require('./../services/user-service');
const jwt = require('jsonwebtoken');
const { signIn } = require('./../middlewares/signIn');
const {jwtSecret} = require('./../env');
 
router.post('/login', async (req, res) =>{ 
   try {
      const loginInfo = await signIn(req.body.token);
      const id = loginInfo.id;
      const jwtToken = jwt.sign({id}, jwtSecret);
      await createUserIfNotExists(id, loginInfo);
      res.json({...loginInfo, token: jwtToken});
   } catch(error) {
      console.log(error)
      res.status(500).send({error});
   }
});


module.exports = router;