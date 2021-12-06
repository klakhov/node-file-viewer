
const router = require('express').Router();

const PageController = require('../app/сontrollers/page-controller');
const auth = require('../app/middleware/jwt');

router.route('/')
      .get(PageController.homePage);

router.route("/login")
      .get(PageController.loginPage);

router.route("/register")
      .get(PageController.registerPage);

router.route('/profile')
      .get(auth, PageController.profilePage);

router.route('/upload')
      .get(auth, PageController.uploadPage);

router.route("/review")
      .get(auth, PageController.reviewPage);

router.route('/reviews')
      .get(auth, PageController.fileReviewsPage);

router.route('/my-files')
      .get(auth, PageController.filesPage);


module.exports = router;