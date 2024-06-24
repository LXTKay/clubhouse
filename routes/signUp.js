var express = require('express');
var router = express.Router();
const signUp_controller = require('../controllers/signUpController');

/* GET users listing. */
router.get('/', signUp_controller.get);
router.post('/', signUp_controller.post);

module.exports = router;