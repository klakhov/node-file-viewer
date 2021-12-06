const auth = require('../app/middleware/jwt');

const router = require('express').Router();

const UserController = require('../app/сontrollers/user-controller');
const FileController = require('../app/сontrollers/file-controller');

router.route("/login")
      .post(UserController.login);

router.route("/register")
      .post(UserController.register);

router.route("/file")
      .get(FileController.show)
      .post(auth, FileController.create);

router.route('/review')
      .get(auth, FileController.getLinks)
      .post(auth, FileController.createReview);

module.exports = router;