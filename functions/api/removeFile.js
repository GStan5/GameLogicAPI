/*
* updates the DB with most up to date info and removes file for current user
*/

const basePath = process.cwd();
const fs = require('fs');

//chalk
const chalk = require('chalk');
const log = console.log;
const newUser = chalk.bold.black.bgGreen;

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;

//skills
const gameFunctions = "../gameFunctions/skills";
const fishing = require (`${gameFunctions}/fishing.js`);


async function removeFile(currentAccount){
    
    fishing.removefisherMap(currentAccount);
    
    //gets file and updates the DB
    let rawdata;
    try {
        rawdata = JSON.parse(fs.readFileSync(`${currentUsers}/${currentAccount}.json`));
    }catch(err){
        //console.error(err);
        //log (`file ${currentAccount}.json does not exist`)
        data = `file ${currentAccount}.json does not exist`;
        return;
    }
    await accountModel.replaceOne({
        account: `${currentAccount}`,
    },
     
        rawdata
    
    );
    // deletes the file from the server
    try {
        fs.unlinkSync(`${currentUsers}/${currentAccount}.json`)
        data = `file ${currentAccount}.json removed`;
    } catch(err) {
        console.error(err);
        data = "Error deleting file";
    }

}

module.exports = { removeFile };