const File = require('../models/file');
const config = require('../../config/config');

module.exports = {
    loginPage: async (req, res) => {
        res.render('login', {layout:'layouts/not-logined'});
    },
    registerPage: async (req, res) => {
        res.render('register', {layout:'layouts/not-logined'});
    },
    profilePage: async (req, res) => {
        const email = req.user.email;
        res.render('profile', {useremail: email});
    },
    uploadPage: async (req, res) => {
        res.render('upload');
    },
    showFile: async (req, res) => {
        const id = req.query.id;
        const file = await File.findOne({publicId: id}).exec();
        if(file){
            res.render('evaluation', {url:`${config.origin}:${config.port}/api/files?id=${id}`});
        }else{
            res.render('404');
        }
    }
}