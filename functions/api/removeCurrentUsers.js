/*
* removes all current logged in users from the server
*/

const basePath = process.cwd();
const fs = require('fs');

//chalk
const chalk = require('chalk');
const log = console.log;
const newUser = chalk.bold.black.underline;

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;



async function removeCurrentUsers(){

    let loggedInUsers = fs.readdirSync(currentUsers);

    if (loggedInUsers.length == 0) { return; }
    
    for (let user of loggedInUsers){
        user = user.split(".")[0];
        //log(user);
        await removeFile(user);
    }
    log(newUser(`logged out ${loggedInUsers.length} users`));
}

async function removeFile(currentAccount){
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



module.exports = { removeCurrentUsers };