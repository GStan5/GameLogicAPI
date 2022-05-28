/*
* compares two inventories for item differences
*/

const basePath = process.cwd();
const fs = require('fs');

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);


function compareInvItems(inventoryOLD, inventoryNEW){

    for (let i = 0; i < inventoryNEW.length; i ++){
        let indexOfItem = inventoryOLD.indexOf(inventoryNEW[i]);
        if(indexOfItem == -1){ return false; }
 
        inventoryOLD.splice(indexOfItem, 1);
    }

    let result;
    inventoryOLD.length == 0 ? result = true : result = false;
    
    return result;

}

module.exports = { compareInvItems }