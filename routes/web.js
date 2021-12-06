
const router = require('express').Router();

const PageController = require('../app/сontrollers/page-controller');
const auth = require('../app/middleware/jwt');

router.route("/login")
      .get(PageController.loginPage);

router.route("/register")
      .get(PageController.registerPage);

router.route('/profile')
      .get(auth, PageController.profilePage);

router.route('/upload')
      .get(auth, PageController.uploadPage);

router.route("/evaluation")
      .get(auth, PageController.showFile);


module.exports = router;