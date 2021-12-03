const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const User = require('../models/user');

module.exports = function(req, res, next){
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, config.secretJWT, async (err, decoded) => {
            if(err || !!!decoded){
                res.status(401).json(["Unauthorized"]);
            }else{
                const user = await User.findOne({_id: decoded.userId});
                if(user){
                    req.user = user;
                    next();
                }else{
                    res.status(401).json(["Specified user do not exist"]);
                }
            }
        })
    }else{
        res.status(401).json(["Token is not specified"])
    }
}