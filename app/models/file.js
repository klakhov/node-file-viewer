const mongoose = require("mongoose");
const assert = require("assert");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
        unique: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: null,
    }],
    reviewsCount: {
        type: Number,
        get: function (){
            return this.reviews.length
        }
    }
});

schema.methods = {
    getUser: async function(){
        await this.populate({
            path: 'user',
        });
        return this.user;
    },
    getReviews: async function(options){
        await this.populate({
            path: 'reviews',
            options
        });
        return this.reviews;
    }
}

module.exports = mongoose.model('File', schema);