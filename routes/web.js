
const router = require('express').Router();

const UserController = require('../app/сontrollers/user-controller');

router.route("/login")
      .get(UserController.loginPage);


router.route("/register")
      .get(UserController.registerPage);


module.exports = router;