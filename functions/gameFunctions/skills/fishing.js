/*
* if game logic is met...
* adds a fish to the current players inventory
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//chalk
const chalk = require('chalk');
const log = console.log;

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);
const googleError = require (`../../../src/google/googleErrorLogger.js`);



const lastCatch = new Map();
const allowedItems = ["rawbluegill 1", "rawbass 1"];
const fishingSpotsX = [];
const fishingSpotsY = [];



async function fishing(data){
    let canCatchFish;
    let currentAccount = data.account;

    data.hasOwnProperty("fishing") && allowedItems.includes(data.fishing)? canCatchFish = true : canCatchFish = false;
    if(!canCatchFish) { googleError.googleSheetsWriterError(data.account, "fishing", `Item: ${data.fishing} cannot be fished`); return; }

    let rawdata = await get.getFile(currentAccount);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let requiredFishingLevel;
    let requiredFishingXP;
    let requiredRod;
    switch (data.fishing){

        case "rawbluegill 1":
            requiredFishingLevel = 1;
            requiredFishingXP = 0;
            requiredRod = "fishingrod 1"
            break;

        case "rawbass 1":
            requiredFishingLevel = 10;
            requiredFishingXP = 1,154;
            requiredRod = "fishingrod1 1"
            break;
    }



    let file = editJsonFile(`${currentUsers}/${currentAccount}.json`);

    //get my inv {check for rod and *bait}, and level
    //get received location to check for it
    //check for last catch time must be 10+ seconds for OG fish spots
    let inventory = file.get("inventory");
    let fishingLevel = file.get("fishingLevel");
    let fishingXP = file.get("fishingXP");
    let timeSinceLastCatch = Date.now()-lastCatch.get(data.account);


    //fishingLevel >= requiredFishingLevel &&
    //fishingXP >= requiredFishingXP  && 
    inventory.includes(requiredRod) &&
    //check for bait if required
    //check player location 
    (!lastCatch.has(data.account) || (timeSinceLastCatch > 10000)) 
    ? canCatchFish = true : canCatchFish = false;
    
    if (!canCatchFish) { googleError.googleSheetsWriterError(data.account, "fishing", `Time since last catch: ${timeSinceLastCatch}ms`); return; }
    let result;
    for (let i = 0; i < inventory.length; i ++){
        if(inventory[i] == "x 1"){

            let roll = Math.floor(Math.random() * 1000);
            if (roll > 500){
                result.caughtFish = true;
                inventory[i] = result.fishing;
                break;
            }
        }
    }

    result.caughtFish = false;

    file.set("inventory", inventory);
    lastCatch.set(data.account, Date.now());
    file.save();

    return result;
}

function removefisherMap(account){

    if (lastCatch.has(account)){
        lastCatch.delete(account)
    }
}



module.exports = { fishing, removefisherMap };
