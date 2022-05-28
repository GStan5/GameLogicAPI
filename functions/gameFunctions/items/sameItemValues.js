/*
* checks logic to make sure no items were created
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;

async function sameItemValues(data){

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    let inventoryOLD = file.get("inventory");
    let bankOLD = file.get("bank");

    let inventoryNEW = data.inventory;
    let bankNEW = data.bank;

    //do old inv, and bank
    let oldItems = new Map();
    for (let i = 0; i < inventoryOLD.length; i ++){
        let item = inventoryOLD[i].split(" ")[0];
        let itemCount = parseInt(inventoryOLD[i].split(" ")[1]);
        oldItems.has(item) ? oldItems.set(item, oldItems.get(item)+itemCount) : oldItems.set(item, itemCount);
    }
    for (let i = 0; i < bankOLD.length; i ++){
        let item = bankOLD[i].split(" ")[0];
        let itemCount = parseInt(bankOLD[i].split(" ")[1]);
        oldItems.has(item) ? oldItems.set(item, oldItems.get(item)+itemCount) : oldItems.set(item, itemCount)
    }


    //do new inv, and bank
    let newItems = new Map();
    for (let i = 0; i < inventoryNEW.length; i ++){
        let item = inventoryNEW[i].split(" ")[0];
        let itemCount = parseInt(inventoryNEW[i].split(" ")[1]);
        newItems.has(item) ? newItems.set(item, newItems.get(item)+itemCount) : newItems.set(item, itemCount);
    }
    for (let i = 0; i < bankNEW.length; i ++){
        let item = bankNEW[i].split(" ")[0];
        let itemCount = parseInt(bankNEW[i].split(" ")[1]);
        newItems.has(item) ? newItems.set(item, newItems.get(item)+itemCount) : newItems.set(item, itemCount)
    }

    let result;
    oldItems.size == newItems.size ? result = true : result = false;
    if (!result) { return result; }

    for (var itemData of oldItems.entries()) {
        let item = itemData[0];
        let itemCount = itemData[1];

        if (item != 'x'){
            (newItems.has(item) && newItems.get(item) == itemCount) ? result = true : result = false;
            if (!result) { return result; }
        }
    }
    
    return result;
}

module.exports = { sameItemValues }