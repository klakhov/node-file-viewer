const File = require('../models/file');
const config = require('../../config/config');

module.exports = {
    pageNotFound: async (req, res) => {
        res.render('404');
    },
    homePage: async (req, res) => {
        res.render('homepage');
    },
    loginPage: async (req, res) => {
        const token = req.cookies.token;
        if(token){
            res.redirect('/profile');
            return;
        }
        res.render('login', {layout:'layouts/not-logined'});
    },
    registerPage: async (req, res) => {
        const token = req.cookies.token;
        if(token){
            res.redirect('/profile');
            return;
        }
        res.render('register', {layout:'layouts/not-logined'});
    },
    profilePage: async (req, res) => {
        const email = req.user.email;
        res.render('profile', {useremail: email});
    },
    uploadPage: async (req, res) => {
        res.render('upload');
    },
    reviewPage: async (req, res) => {
        const id = req.query.id;
        const file = await File.findOne({publicId: id}).exec();
        const user = await file.getUser();
        if(file){
            res.render('review', {
                url:`${config.origin}:${config.port}/api/file?id=${id}`,
                user: user.email,
                filename: file.originalName
            });
        }else{
            res.render('404');
        }
    },
    filesPage: async (req, res) => {
        const user = req.user;
        const files = await user.getFiles({ lean: true });
        res.render('my-files', {files});
    },
    fileReviewsPage: async(req, res) => {
        const file = await File.findOne({publicId: req.query.id}).exec();
        const user = req.user;
        if(file){
            const reviews = await file.getReviews({ lean: true });
            reviews.forEach(element => {
                const positiveArray = [...Array(element.grade).keys()];
                const fullArray = [...Array(5).keys()];
                element.gradeHelper = fullArray.map((element)=>{
                    if(positiveArray.includes(element)){
                        return { stared: true }
                    }
                    return { stared: false }
                });
            });
            res.render('reviews', {
                abc: 123,
                filename: file.originalName,
                hasReviews: reviews.length !== 0,
                username: user.email,
                reviews,
            });
        }else{
            res.render(404);
        }
    }
}