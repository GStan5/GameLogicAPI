/*
* returns event hiscores
*/
const express = require("express");
const router = express.Router();

const basePath = process.cwd();
const fs = require('fs');

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const massUpdate = require ('../functions/api/massUpdate.js');

//chalk
const chalk = require('chalk');
const log = console.log;


router.get('', async function (req, res) {

    await massUpdate.massUpdate();

    (req.headers.hasOwnProperty("data") && req.headers.data.hasOwnProperty("request")) ? data = req.headers.data : data = req.body.data;

    //log("DATA: " + data);
    //res.json(data.request);
    //request = data.request;

    //choose the values you want to return and the main variable
    const results =  await accountModel.aggregate([{
        $project: {
            _id: 0, 
            account: 1,
            timePlayed: 1,
            fishCooked: 1, 
               
        }
    }]).sort({ fishCooked: -1 });


    res.json(results)
});

module.exports = router;



/*

//------------------ONLY NEED THIS FOR FISHING/COOKING EVENT--------------------------

let itemName = "bluegill"
let itemValue;

//log(file.get("bank"))
let bankArray = (file.get("bank"))
//log(bankArray.length)
for (let i = 0; i < bankArray.length; i++){
    if (bankArray[i].startsWith(itemName)){
        let fishCooked = bankArray[i].split(' ');
        itemValue = parseInt(fishCooked[1]);
        //log(`${itemName}: ${itemValue}`);
        file.set("fishCooked", itemValue);
    }
}

//-------------------------------------------------------------------------------------

*/