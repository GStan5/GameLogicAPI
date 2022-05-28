/*
* drops an item from the players ivnentory if the logic is accepted
* { May need to reconsider setting each variable of the new array for the Inv }
* { if any weaknesses are found,  it returns a map so if needed it will be easy }
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
const googleError = require (`../../../src/google/googleErrorLogger.js`);

const itemsOnGround = new Map();

async function dropItem(data){
    
    let hasInv;
    data.hasOwnProperty("inventory") ? hasInv = true : hasInv = false;
    if (!hasInv) { return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let inventoryOLD = file.get("inventory");
    let inventoryNEW = data.inventory;

    const result = compare.compareInv(inventoryOLD, inventoryNEW);
    if (!result) { googleError.googleSheetsWriterError(data.account, "dropItem", "No item was dropped"); return; }

    for (let differences of result.entries()){

        let oldItem = differences[1].split(",")[0];
        let newItem = differences[1].split(",")[1];

        if(newItem != "x 1"){ googleError.googleSheetsWriterError(data.account, "dropItem", "[Warning] New item was NOT a placeholder"); return ; }

        !itemsOnGround.has(data.account) ? itemsOnGround.set(data.account, [oldItem]) : itemsOnGround.get(data.account).push(oldItem);
    }

    file.set("inventory", inventoryNEW);
    file.save();

    return file.data;
}

function removeItemMap(account){

    if (itemsOnGround.has(account)){
        itemsOnGround.delete(account)
    }
}

function removeItemFromMap(account, index){

    if (itemsOnGround.has(account)){
        itemsOnGround.get(data.account).splice(index, 1);
    }
}


module.exports = { dropItem, itemsOnGround, removeItemMap, removeItemFromMap }