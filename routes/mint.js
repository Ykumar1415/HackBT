// /image/nft
const express = require('express'); 
const router = express.Router();
  
  
const {mintcontroller} = require('../controllers/mint');

router.post('/file/nft', mintcontroller); 
 
 module.exports = router;