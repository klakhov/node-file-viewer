const User = require('../models/user');


module.exports = {
    loginPage: async (req, res) => {
        res.render('login', {layout:'layouts/not-logined'});
    },
    registerPage: async (req, res) => {
        res.render('register', {layout:'layouts/not-logined'});
    },

    register: async (req, res) => {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        });
        try {
            await user.setNewPassword(req.body.password, req.body.repeatPassword);
            const token = jwt.sign({userId: user._id}, config.secretKey);
            res.status(200).json({token: token});
        } catch (e) {
            let errors = [];
            if (e instanceof assert.AssertionError) {
                errors.push("Passwords do not match");
            } else {
                for (let error in e.errors) {
                    errors.push(e.errors[error].message);
                }
            }
            res.status(400).json(errors);
        }
    },

    login: async (req, res) => {
        const user = await User.findOne({email: req.body.email}).exec();
        if (user) {
            //check if request data is correct
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                res.status(400).json(["Wrong email or password"])
            }
            // success
            const token = jwt.sign({userId: user._id}, config.secretKey);
            res.status(200).json({token: token, verified: user.verified});
        } else {
            //user is not found
            res.status(400).json(["That email is not registered"])
        }

        res.status(200).send();
    },
}