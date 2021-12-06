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
const Review = require('../models/review');

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

    getLinks: async (req, res) => {
        const user = req.user;
        const others = await File.find({user: {$ne: user._id}}).lean().exec();
        const fileIds = [];
        let i=0;
        let looping = false;
        let loopingArr = [];
        others.forEach((elem)=>{
            elem.reviewsCount = elem.reviews.length;
        })
        others.sort((a, b) => a.reviewsCount - b.reviewsCount);
        while(i<others.length){
            if(fileIds.length<3){
                if(looping){
                    loopingArr.push(others[i]);
                    if(others[i+1] === undefined || others[i].reviews.length !== others[i+1].reviews.length){
                        looping = false;
                        while(loopingArr.length !== 0 && fileIds.length<3){
                            const randIndex = Math.floor(Math.random()*(loopingArr.length));
                            const randomFile = loopingArr[randIndex];
                            fileIds.push(randomFile.publicId);
                            loopingArr.splice(randIndex, 1);
                        }
                    }
                }else if( others[i+1] === undefined || others[i].reviews.length !== others[i+1].reviews.length){
                    fileIds.push(others[i].publicId);
                }else{
                    looping = true;
                    loopingArr = [others[i]];
                }
                i++;
            }else{
                break;
            }
        }
        res.status(200).json(fileIds);
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
    },

    createReview: async (req, res) => {
        const user = req.user;
        const file = await File.findOne({publicId: req.body.fileId}).exec();
        if(!file){
            res.status(404).json('File not found');
            return;
        }
        const review = new Review({
            grade: req.body.grade,
            comment: req.body.comment,
            user: user._id,
            file: file._id,
        });
        user.reviews.push(review);
        file.reviews.push(review);
        await user.save();
        await file.save();
        await review.save();
        res.status(200).json('ok');
    }
}