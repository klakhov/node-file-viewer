const auth = require('../app/middleware/jwt');

const router = require('express').Router();

const UserController = require('../app/сontrollers/user-controller');
const FileController = require('../app/сontrollers/file-controller');

router.route("/login")
      .post(UserController.login);

router.route("/register")
      .post(UserController.register);

router.route("/files")
      .post(auth, FileController.create);

router.route('/evaluation')
      .get(auth, FileController.getLinks);

module.exports = router;