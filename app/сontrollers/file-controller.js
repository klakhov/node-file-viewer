const jwt = require("jsonwebtoken");
const assert = require("assert").strict;
const bcrypt = require('bcrypt');
const config = require('../../config/config');

const User = require('../models/user');

module.exports = {
    create: async (req, res) => {
        res.send(200).json('ok');
    }
}