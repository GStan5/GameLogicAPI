/*
* gets account info for current user
*/

const basePath = process.cwd();
const fs = require('fs');

//chalk
const chalk = require('chalk');
const log = console.log;
const newUser = chalk.bold.black.bgGreen;

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const get = require ('./get.js');
const create = require ('./createFile.js');


async function getAccountInfo(data){
    let currentAccount = data.account;

    let rawdata = await get.getFile(currentAccount);
    if (rawdata != false) { return rawdata; } 

    //gets data from DB or creates a new one if account is a new user
    try {
        let userData = await accountModel.findOne({account: `${currentAccount}`}).collation( { locale: 'en', strength: 2 } );
        if(!userData){
            log (newUser(`no account for: ${currentAccount}...creating new account!`));
            userData = await accountModel.create({account: `${currentAccount}`});
            userData.save();
        }
        //create JSON docuemnt
        await create.createFile(currentAccount);
        rawdata = await get.getFile(currentAccount);
    }catch(err){
        log(err)
    }

    return rawdata;
}

module.exports = { getAccountInfo };