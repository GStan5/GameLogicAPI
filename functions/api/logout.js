/*
* logges out requested user from server
* UPDATES { locatin, & timePlayed}
*/

const basePath = process.cwd();
const fs = require('fs');
const editJsonFile = require("edit-json-file");

//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;
const remove = require ('./removeFile.js');

//Game Logic
const gameFunctions = "../gameFunctions";
const gameLogicMaps =  require (`${gameFunctions}/removeFromGameLogicMaps.js`);


async function logout(data){
    let currentAccount = data.account;

    //checks for file
    try {
        rawdata = JSON.parse(fs.readFileSync(`${currentUsers}/${currentAccount}.json`));
    }catch(err){
        return;
    }

    let file = editJsonFile(`${currentUsers}/${currentAccount}.json`);

    file.set("currentLocationX", parseFloat(data.currentLocationX));
    file.set("currentLocationY", parseFloat(data.currentLocationY));
    file.set("timePlayed", parseFloat(data.timePlayed));

    file.save();

    await remove.removeFile(currentAccount);
    gameLogicMaps.removeFromGameLogicMaps(currentAccount);

    return ("logged out");
    
}



module.exports = { logout };