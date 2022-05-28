/*
* returns the health of the server
*/
const express = require("express");
const router = express.Router();

//health
router.get('', function (req, res){
	res.sendStatus(200);
});


module.exports = router;