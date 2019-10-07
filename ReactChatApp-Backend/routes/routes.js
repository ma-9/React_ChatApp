const express = require('express');
const router = express.Router();

router.get('/', (req,res,next)=>{
    res.send('Backend is running fine !');
}); 

module.exports = router;