/*
* pickups the item if the item is available to be picked up
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);
const compare = require(`./compareInv.js`);
const dropItem = require('./dropItem.js');
const googleError = require (`../../../src/google/googleErrorLogger.js`);

async function pickupItem(data){

    let hasInv;
    data.hasOwnProperty("inventory") ? hasInv = true : hasInv = false;
    if (!hasInv) { googleError.googleSheetsWriterError(data.account, "pickupItem", "No INV in data"); return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let inventoryOLD = file.get("inventory");
    let inventoryNEW = data.inventory;

    const result = compare.compareInv(inventoryOLD, inventoryNEW);
    if (!result) { googleError.googleSheetsWriterError(data.account, "pickupItem", "No item was picked up"); return; }

    for (let differences of result.entries()){

        let oldItem = differences[1].split(",")[0];
        let newItem = differences[1].split(",")[1];
        if(oldItem != "x 1"){ googleError.googleSheetsWriterError(data.account, "pickupItem", `Old item: ${oldItem}, is not a placeholder`); return ; }

        let indexOfItem
        (dropItem.itemsOnGround.has(data.account)) ? dropItem.itemsOnGround.get(data.account).indexOf(newItem) : indexOfItem = -1;
        if (indexOfItem == -1) { googleError.googleSheetsWriterError(data.account, "pickupItem", `[Warning] New item: ${newItem}, is not available to be picked up`); return; }

        dropItem.removeItemFromMap(data.account, indexOfItem);
    }

    file.set("inventory", inventoryNEW);
    file.save();

    return file.data;
}

module.exports = { pickupItem }