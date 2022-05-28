/*
* compares two inventories for index differences 
*/

const basePath = process.cwd();
const fs = require('fs');

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);


function compareInv(inventoryOLD, inventoryNEW){
    let differences = new Map();
    let isDifferent =  false;

    for (let i = 0; i < inventoryOLD.length; i ++){
        if(inventoryOLD[i] != inventoryNEW[i]){
            isDifferent = true;
            differences.set(i, `${inventoryOLD[i]},${inventoryNEW[i]}`);
        }
    }

    if (isDifferent) { return differences; }
    return isDifferent;

}

module.exports = { compareInv }