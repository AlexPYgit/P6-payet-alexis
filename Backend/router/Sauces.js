const express = require('express');
const router = express.Router();

const SauceCtrl = require('../controllers/Sauces');
const auth = require('../midlewear/auth');
const multer = require('../midlewear/multer-config');

router.post('/', auth, multer,  SauceCtrl.creatingSauce);
router.post('/:id/like', auth, SauceCtrl.liked);
router.get('/', auth, SauceCtrl.getAllSauce);
router.get('/:id', auth, SauceCtrl.getOneSauce);
router.put('/:id', auth, SauceCtrl.modifySauce);
router.delete('/:id', auth, SauceCtrl.deleteSauce);


module.exports = router;