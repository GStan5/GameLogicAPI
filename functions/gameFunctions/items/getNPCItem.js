/*
* adds item from an NPC to players inv
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

const allowedItems = ["fishingrod 1"]

async function getNPCItem(data){
    
    let canGetItem = false;
    data.hasOwnProperty("npcitem") && allowedItems.includes(data.npcitem) ? canGetItem = true : canGetItem = false;
    if (!canGetItem){ googleError.googleSheetsWriterError(data.account, "getNPCItem", `[Warning] requested ${data.npcitem}`); return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let inventory = file.get("inventory");

    for (let i = 0; i < inventory.length; i ++){
        if(inventory[i] == "x 1"){
            inventory[i] = data.npcitem;
            break;
        }
    }

    file.set("inventory", inventory);
    file.save();

    return file.data;
}

module.exports = { getNPCItem }             