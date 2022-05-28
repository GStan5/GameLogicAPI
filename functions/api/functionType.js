/*
* chooses desired function from req data
*/
require('dotenv').config()
const util = require('util')


//chalk
const chalk = require('chalk');
const log = console.log;

//Models & Paths
const login = require ('./login.js') 
const logout = require ('./logout.js');

const skills = "../gameFunctions/skills";
const fishing = require (`${skills}/fishing.js`);
const cook = require (`${skills}/cooking.js`);
const location = "../gameFunctions/location";
const positon = require (`${location}/updatePosition.js`);

const itemFunctions = "../gameFunctions/items";
const NPC = require (`${itemFunctions}/getNPCItem.js`);
const drop = require (`${itemFunctions}/dropItem.js`)
const pickup = require (`${itemFunctions}/pickupItem.js`)
const updateUI = require (`${itemFunctions}/updateUI.js`)
const bank = require (`${itemFunctions}/bankDepositOrWithdraw.js`)


async function functionType(data){

    data.version == process.env.currentVersion ? data.version = "ok" : data.version = "update";
    if (data.version = "update") { return data.version; } 

    switch (data.function){

        case "login":
            //log("login User: " + data.account);
            return await login.getAccountInfo(data);

        case 'logout':
            //log("logout User: " + data.account);
            return await logout.logout(data);
        
        case 'fishing':
            //log("fishing");
            return await fishing.fishing(data);

        case 'getnpcitem':
            //log("getNPCItem");
            return await NPC.getNPCItem(data);

        case 'cooking':
            //log("cooking");
            return await cook.cooking(data);

        case 'dropitem':
            //log("dropitem");
            return await drop.dropItem(data);

        case 'pickupitem':
            //log("pickupitem");
            return await pickup.pickupItem(data);

        case 'updateui':
            //log("updateUI");
            return await updateUI.updateUI(data);
        
        case 'bank':
            //log("bank");
            return await bank.bankWithdrawOrDeposit(data);

        case 'updatepos':
            //log("updatepos");
            return await positon.updatePosition(data);
    

    }
} 


module.exports = { functionType };