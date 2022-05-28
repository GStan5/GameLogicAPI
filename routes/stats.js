/*
* returns the stats for the server
* { Total users, logged in users, time played}
*/
const express = require("express");
const router = express.Router();

const basePath = process.cwd();
const fs = require('fs');

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;
const massUpdate = require ('../functions/api/massUpdate.js');


//stats
router.get('', async function (req, res) {
    
    let stats = new Object();
    await massUpdate.massUpdate();

    let loggedInUsers =fs.readdirSync(currentUsers).length;

    const results =  await accountModel.aggregate([{
        $project: {
            _id: 0, 
            account: 1,
            timePlayed: 1,
            //fishCooked: 1, 
               
        }
    }]);

    //let overallFishCooked = 0;
    let overallTimePlayed = 0;
    for (let i = 0; i < results.length; i++){    
        //overallFishCooked += results[i].fishCooked;
	    overallTimePlayed += results[i].timePlayed;	
    }  
    

    stats.totalUsers = results.length;
    stats.loggedInUsers = loggedInUsers;
    //stats.overallFishCooked = overallFishCooked;
    stats.overallTimePlayed = overallTimePlayed;
    res.json(stats);
});

module.exports = router;
