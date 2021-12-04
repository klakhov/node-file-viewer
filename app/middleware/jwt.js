const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const User = require('../models/user');

module.exports = function(req, res, next){
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, config.secretJWT, async (err, decoded) => {
            if(err || !!!decoded){
                res.clearCookie('token');
                res.redirect('/login');
            }else{
                const user = await User.findOne({_id: decoded.userId});
                if(user){
                    req.user = user;
                    next();
                }else{
                    res.clearCookie('token');
                    res.redirect('/login');
                }
            }
        })
    }else{
        res.redirect('/login');
    }
}