/*
* creates a files for requested user
*/

const basePath = process.cwd();
const fs = require('fs');


//chalk
const chalk = require('chalk');
const log = console.log;

const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;

//creates a file for currentAccount
async function createFile(currentAccount){
    let userData = await accountModel.findOne({account: `${currentAccount}`}).collation( { locale: 'en', strength: 2 } );
    fs.writeFileSync(`${currentUsers}/${currentAccount}.json`, JSON.stringify(userData, null, 2),
    function (err) {
        if (err) {
            log(err);
        }
    });
}

module.exports = { createFile };