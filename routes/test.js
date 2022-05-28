/*
* returns the health of the server
*/
const express = require("express");
const router = express.Router();

//health
router.get('', function (req, res){
    let data;
	(req.headers.hasOwnProperty("data") && req.headers.data.hasOwnProperty("function")) ? data = req.headers.data : data = req.body.data;

    console.log(`test: \n${data}`);
    res.send(data);
});


module.exports = router;