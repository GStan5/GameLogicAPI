/*
*
*/

const blockedModel = require (`${basePath}/models/blockedSchema`);

const allrequest = async function (req, res, next) {
//async function allrequest(req, res, next) {

    let data;
    let accessAllowed = true;

    //checks for the data in the body OR headers
    (req.headers.hasOwnProperty("data") && req.headers.data.hasOwnProperty("function")) ? data = req.headers.data : data = req.body.data;

    log(`logged request: ${req.url}`);
    if (data != undefined){
        log(`   Encrypted : ${req.socket.encrypted}
                logged request: ${req.url}
                Origin: ${req.header('Origin') == process.env.origin}
                IPs: ${req.ip}
                account: ${data.account}
        `);
        //check Origin
        //if (!(req.header('Origin') == process.env.origin)) { accessAllowed = false; }
        
        //check for blocked ip or account
        await blockedModel.create({blockedAccounts: `test`});
        let isBlocked = await blockedModel.findOne({ $or: [{blockedAccounts: `${data.account}`}, {blockedIPS: `${req.ip }`}]}).collation( { locale: 'en', strength: 2 } );
        if (isBlocked) { accessAllowed = false; }
        

        //make sure account isnt already logged in
        if (data.function == "login" && logoutTimerMap.has(data.account)) { 
            google.googleSheetsWriter("FALSE ALI", req);
            return res.send("Account already logged in"); 
        }
    }

    google.googleSheetsWriter(accessAllowed, req);
    if(!accessAllowed) { return log(errorMsg(`[ACCESS DENIED]`)); }

    next();
}

module.exports = { allrequest }