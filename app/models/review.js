const mongoose = require("mongoose");
const assert = require("assert");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

schema.methods = {
    getUser: async function(){
        await this.populate({
            path: 'user',
        });
        return this.user;
    }
}

module.exports = mongoose.model('Review', schema);