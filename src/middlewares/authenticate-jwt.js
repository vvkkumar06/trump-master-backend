const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./../env')

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.json({ error: 'Invalid Token'});
            }
            req.user = user;
            next();
        });
        
    } else {
        return res.json({ error: 'Invalid Token'});
    }
}

module.exports ={
    authenticateJWT
}