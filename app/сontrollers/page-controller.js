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
}