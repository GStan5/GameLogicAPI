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
const compareItems = require(`./compareInvItems.js`);
const googleError = require (`../../../src/google/googleErrorLogger.js`);


async function updateUI(data){
    
    let hasInv;
    data.hasOwnProperty("inventory") ? hasInv = true : hasInv = false;
    if (!hasInv) { googleError.googleSheetsWriterError(data.account, "updateUI", "No INV in data"); return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let inventoryOLD = file.get("inventory");
    let inventoryNEW = data.inventory;

    const resultItems = compareItems.compareInvItems(inventoryOLD, inventoryNEW)
    if (!resultItems) { googleError.googleSheetsWriterError(data.account, "updateUI", "No items were moved"); return; }

    file.set("inventory", inventoryNEW);
    file.save();

    return file.data;

}

module.exports = { updateUI }