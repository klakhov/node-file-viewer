
const router = require('express').Router();

const UserController = require('../app/сontrollers/user-controller');

const auth = require('../app/middleware/jwt');

router.route("/login")
      .get(UserController.loginPage);


router.route("/register")
      .get(UserController.registerPage);

router.route('/profile')
      .get(auth, UserController.profilePage);


module.exports = router;