const express = require('express');
const router = express.Router();
const password = require("../middleware/password");

const userCtrl = require('../controllers/user');

// Controle la validité du MDP avant de passer au controller
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;