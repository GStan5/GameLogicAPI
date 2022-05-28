/*
* returns the health of the server
*/
const express = require("express");
const router = express.Router();


router.get(':v', function (req, res){

    if (req.params.v == process.env.vv){
        res.sendStatus(200);
    }else{
        res.send("update");
    }

});

module.exports = router;