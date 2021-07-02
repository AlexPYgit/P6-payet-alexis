const express = require('express');
const router = express.Router();

const auth  = require('../midlewear/auth');
const userCtrl = require('../controllers/User');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login, auth);

module.exports= router;