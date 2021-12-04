const mongoose = require("mongoose");
const assert = require("assert");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});

schema.methods = {

}

module.exports = mongoose.model('File', schema);