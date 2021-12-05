const jwt = require("jsonwebtoken");
const assert = require("assert").strict;
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const fs = require('fs');
const nanoid = require('nanoid').nanoid;

const User = require('../models/user');
const File = require('../models/file');

module.exports = {
    create: async (req, res) => {
        if(req.files.file){
            const file = req.files.file;
            const user = req.user;
            fs.writeFileSync('./files-storage/'+file.name, file.data);
            const fileDB = new File({
                name: file.name,
                publicId: nanoid(),
                user: user._id,
            });
            req.user.files.push(fileDB);
            await fileDB.save();
            await user.save();
            res.sendStatus(200);
        }else{
            res.send(400).json(['No file was specified']);
        }
    },

    getLinks: async (req, res) =>{
        const count = await File.count().exec();
        console.log(count);
        const randIndex = Math.floor(Math.random()*count);
        console.log(randIndex);
        const randomFile = await File.findOne().skip(randIndex).exec();
        console.log(randomFile);
        res.send(200);
    }
}