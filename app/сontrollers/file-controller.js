const jwt = require("jsonwebtoken");
const assert = require("assert").strict;
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const fs = require('fs');
const nanoid = require('nanoid').nanoid;
const fileExtension = require('../utils/file-ext');
const path = require('path');

const User = require('../models/user');
const File = require('../models/file');

module.exports = {
    create: async (req, res) => {
        if(req.files.file){
            const file = req.files.file;
            const user = req.user;
            const protectedFileName = nanoid()+'.'+fileExtension(file.name);
            fs.writeFileSync('./files-storage/'+protectedFileName, file.data);
            const fileDB = new File({
                name: protectedFileName,
                originalName: file.name,
                publicId: nanoid(),
                user: user._id,
            });
            req.user.files.push(fileDB);
            await fileDB.save();
            await user.save();
            res.status(200).json('ok');
        }else{
            res.status(400).json(['No file was specified']);
        }
    },

    getLinks: async (req, res) =>{
        const count = await File.count().exec();
        const randIndex = Math.floor(Math.random()*count);
        const randomFile = await File.findOne().skip(randIndex).exec();
        res.status(200).json([randomFile.publicId]);
    },

    show: async (req, res) => {
        const id = req.query.id;
        const file = await File.findOne({publicId: id}).exec();
        if(file){
            const filePath = path.join(__dirname, './../../files-storage/', file.name);
            res.sendFile(filePath);
        }else{
            res.status(404).json('File not found');
        }
    }
}