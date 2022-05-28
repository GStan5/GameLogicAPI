/*
* updates all users info to the DB
*/

const basePath = process.cwd();
const fs = require('fs');


const accountModel = require (`${basePath}/models/accountSchema`);
const currentUsers = `${basePath}/currentUsers`;

async function massUpdate(){

    let loggedInUsers = fs.readdirSync(currentUsers);

    if (loggedInUsers.length == 0) { return; }
    
    for (let user of loggedInUsers){
        user = user.split(".")[0];
        console.log(user);
        let rawdata
        try {
            console.log("tried");
            rawdata = JSON.parse(fs.readFileSync(`${currentUsers}/${user}.json`));
        }catch(err){
            console.log("gave up");
            return;
        }
        console.log(rawdata);
        await accountModel.replaceOne({
            account: `${user}`,
        },
            
            rawdata
        
        ).collation( { locale: 'en', strength: 2 } );

    }
}


module.exports = { massUpdate };