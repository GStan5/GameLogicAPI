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
const googleError = require (`../../../src/google/googleErrorLogger.js`);


async function updatePosition(data){
    
    let hasPos;
    (data.hasOwnProperty("currentLocationX") && data.hasOwnProperty("currentLocationY"))? hasPos = true : hasPos = false;
    if (!hasPos) { googleError.googleSheetsWriterError(data.account, "updatePosition", "No PoS in data"); return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let currentLocationX = data.currentLocationX;
    let currentLocationY = data.currentLocationY;
    
    let correctValue;
    (currentLocationX % .5 == 0 && currentLocationY % .5 == 0) ? correctValue = true : correctValue = false;
    if (!correctValue) { googleError.googleSheetsWriterError(data.account, "updatePosition", "Incorrect position Values"); return; }

    file.set("currentLocationX", currentLocationX);
    file.set("currentLocationY", currentLocationY);
    file.save();

    return file.data;

}

module.exports = { updatePosition }