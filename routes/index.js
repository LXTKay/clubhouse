const express = require('express');
const index_controller = require('../controllers/indexController');
const router = express.Router();

/* GET home page. */
router.get("/", index_controller.get);

router.post("/logIn", index_controller.logIn);

router.get("/logOut", index_controller.logOut);

router.post("/postMsg", index_controller.postMsg);

router.post("/activateCode", index_controller.activateCode);

module.exports = router;

/*
Landing Page
Sign Up
Log In
Message Page */