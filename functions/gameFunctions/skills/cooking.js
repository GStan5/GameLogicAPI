/*
* cooks OR burns item if game logic is passed
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);
const googleError = require (`../../../src/google/googleErrorLogger.js`);


const lastCook = new Map();
const allowedItems = new Map([
    ["rawbluegill 1", "bluegill 1"],
    ["rawbass 1", "bass 1"],
]);


async function cooking(data){
    let canCookItem = false;

    data.hasOwnProperty("cookitem") && allowedItems.has(data.cookitem) ? canCookItem = true : canCookItem = false;
    if (!canCookItem) { googleError.googleSheetsWriterError(data.account, "cooking", `Item: ${data.cookitem} cannot be cooked`); return; }

    let timeSinceLastCooked =Date.now()-lastCook.get(data.account); 
    (!lastCook.has(data.account) || timeSinceLastCooked > 7500)
    ? canCookItem = true : canCookItem = false;

    if (!canCookItem) { googleError.googleSheetsWriterError(data.account, "cooking", `Time since last cook: ${timeSinceLastCooked}ms`); return; }

    let currentAccount = data.account;

    let rawdata = await get.getFile(currentAccount);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${currentAccount}.json`);
    let inventory = file.get("inventory");

    let hasItemToCook;
    inventory.includes(data.cookitem) ? hasItemToCook = true : hasItemToCook = false;
    if (!hasItemToCook) { googleError.googleSheetsWriterError(data.account, "cooking", `Does not have ${data.cookitem} to cook`); return; }

    for (let i = 0; i < inventory.length; i ++){
        if(inventory[i] == data.cookitem){
            let random = Math.floor(Math.random() * 101);
            random < 71 ? inventory[i] = allowedItems.get(data.cookitem) : inventory[i] = "x 1";
            break;
        }
    }

    file.set("inventory", inventory);
    lastCook.set(data.account, Date.now());
    file.save();

    return file.data;
}

function removeCookerMap(account){

    if (lastCook.has(account)){
        lastCook.delete(account)
    }
}


module.exports = { cooking , removeCookerMap }  