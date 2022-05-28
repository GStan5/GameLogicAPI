/*
* gets the file for the current user
*/

const basePath = process.cwd();
const fs = require('fs');

//Models & Paths
const currentUsers = `${basePath}/currentUsers`;


//gets file for currentAccount
async function getFile (currentAccount){

    try {
        return data = await JSON.parse(fs.readFileSync(`${currentUsers}/${currentAccount}.json`));
    }catch(err){
        return data = false;
    }
    
}

module.exports = { getFile };