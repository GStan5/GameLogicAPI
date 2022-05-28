/*
* checks logic for depositing or withdrawing items from your inv -> bank or vise versa
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;
const apiFunctions = "../../api";
const login = require (`${apiFunctions}/login.js`);
const get = require (`${apiFunctions}/get.js`);
const itemValues = require ('./sameItemValues.js');
const googleError = require (`../../../src/google/googleErrorLogger.js`);

async function bankWithdrawOrDeposit(data){
    
    let hasInv;
    data.hasOwnProperty("inventory") ? hasInv = true : hasInv = false;
    if (!hasInv) { googleError.googleSheetsWriterError(data.account, "bankDepositOrWitdraw", "No INV in data"); return; }

    let rawdata = await get.getFile(data.account);
    if (!rawdata) { await login.getAccountInfo(data); } 

    const result = await itemValues.sameItemValues(data);
    if (!result) { googleError.googleSheetsWriterError(data.account, "bankDepositOrWitdraw", "[WARNING] Not the same number of Item Values");return; }

    let file = editJsonFile(`${currentUsers}/${data.account}.json`);
    file.set("inventory", data.inventory);
    file.set("bank", data.bank);
    file.save();

    return file.data;
}

module.exports = { bankWithdrawOrDeposit }