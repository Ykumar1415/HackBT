// /image/nft
const express = require('express'); 
const router = express.Router();
const {getTxn} = require('../controllers/mint');
const {transaction} = require('../controllers/mint');
const {mintcontroller} = require('../controllers/mint');
const {getTransactionids} = require('../controllers/mint');
const {cloudupload} = require('../controllers/mint');
router.post('/file', cloudupload);
router.post('/file/nft', mintcontroller); 
router.get('/transactions', getTransactionids);
router.get('/transaction', transaction);
router.post('/getTxn',getTxn)

 
 module.exports = router;