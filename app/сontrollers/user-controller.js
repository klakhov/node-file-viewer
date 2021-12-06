const jwt = require("jsonwebtoken");
const assert = require("assert").strict;
const bcrypt = require('bcrypt');
const config = require('../../config/config');

const User = require('../models/user');


module.exports = {
    register: async (req, res) => {
        const token = req.cookies.token;
        if(token){
            res.redirect('/profile');
            return;
        }
        let user = await User.findOne({email: req.body.email}).exec();
        if(user){
            res.status(400).json(["That email is already registered"]);
            return;
        }
        user = new User({
            email: req.body.email,
            password: req.body.password,
        });
        try {
            await user.setNewPassword(req.body.password, req.body.repeatPassword);
            const token = jwt.sign({userId: user._id}, config.secretJWT);
            res.status(200).json({token: token});
        } catch (e) {
            let errors = [];
            if (e instanceof assert.AssertionError) {
                errors.push("Passwords do not match");
            } else {
                for (let error in e.errors) {
                    errors.push(e.errors[error].message);
                }
            }
            res.status(400).json(errors);
        }
    },

    login: async (req, res) => {
        const user = await User.findOne({email: req.body.email}).exec();
        if (user) {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                res.status(400).json(["Wrong email or password"])
                return;
            }
            const token = jwt.sign({userId: user._id}, config.secretJWT);
            res.status(200).json({token: token});
        } else {
            res.status(400).json(["That email is not registered"])
        }
    },
}