require('dotenv').config()
const basePath = process.cwd();
const express = require("express");
const router = express.Router();
const httpsPORT = process.env.PORT || 443;
const httpPORT = process.env.PORT || 80; //8080
const app = express();
const mongoose = require("mongoose");
const fs = require('fs');
const https = require ("https");
const http = require ("http");
const cors = require("cors");
const helmet = require ('helmet');
const chalk = require('chalk');
const editJsonFile = require("edit-json-file");
const util = require('util')


//Models & Paths
const accountModel = require (`${basePath}/models/accountSchema`);
const blockedModel = require (`${basePath}/models/blockedSchema`);
const currentUsers = `${basePath}/currentUsers`;


//functions
const apiFunctions = "./functions/api";
const remove = require (`${apiFunctions}/removeFile.js`);  
const freshStart = require (`${apiFunctions}/removeCurrentUsers.js`);
const getFunction = require (`${apiFunctions}/functionType.js`);
const google = require (`./src/google/googleRequestLogger.js`);


//chalk
const log = console.log;
const success = chalk.bold.green.underline;
const errorMsg = chalk.bold.bgRed;


//app settings
app.use(helmet());
app.use(express.json());
app.use(cors({origin: "*",}));
const allrequest = async function (req, res, next) {

    let data;
    let accessAllowed = true;

    //checks for the data in the body OR headers
    req.headers.hasOwnProperty("data") ? data = JSON.parse(req.headers.data) : data = false;
    //if (process.env.dev == "true") { req.body.hasOwnProperty("data") ? data = req.body.data : data = false; }
    if(!data.hasOwnProperty("function")) { return; }

    log(`logged request: ${req.url}`);
    if (data != undefined){
        // log(`   logged request: ${req.url}
        //         Encrypted : ${req.socket.encrypted}
        //         logged request: ${req.url}
        //         Origin: ${req.header('Origin') == process.env.origin}
        //         IPs: ${req.ip}
        //         account: ${data.account}
        // `);

        //check Origin
        if (process.env.dev == "false" && req.header('Origin') != process.env.origin ) { accessAllowed = false; }
        
        //check for blocked ip or account
        await blockedModel.create({blockedAccounts: `test`});
        let isBlocked = await blockedModel.findOne({ $or: [{blockedAccounts: `${data.account}`}, {blockedIPS: `${req.ip }`}]}).collation( { locale: 'en', strength: 2 } );
        if (isBlocked) { accessAllowed = false; }
        

        // [cant do this yet sadly] make sure account isnt already logged in
        // if (data.function == "login" && logoutTimerMap.has(data.account)) { 
        //     google.googleSheetsWriter("FALSE ALI", req);
        //     return res.send("Account already logged in"); 
        // }
    }

    google.googleSheetsWriter(accessAllowed, req);
    if(!accessAllowed) { return log(errorMsg(`[ACCESS DENIED]`)); }

    next();
}

app.use(allrequest);


//routes
const routes = ('./routes');
const health = require(`${routes}/health.js`); app.use('/health', health);
const stats = require(`${routes}/stats.js`); app.use('/stats', stats);
const version = require(`${routes}/version.js`); app.use('/version', version);
const hiscores = require(`${routes}/hiscores.js`); app.use('/hiscores', hiscores);
const test = require(`${routes}/test.js`); app.use('/test', test);


//creates https & http server
let mongoDBSRV;
if (process.env.dev == "true"){
    mongoDBSRV = process.env.TestDBuri;
    http.createServer(app).listen(httpPORT);
    log(success("[HTTP] server is runing at port " + httpPORT));
}else{
    mongoDBSRV = process.env.DBuri;
    const httpsConfig = {
        key: fs.readFileSync("./pem/key.pem"),
        cert: fs.readFileSync("./pem/cert.pem"),
    }
    https.createServer(httpsConfig, app).listen(httpsPORT);
    log(success("[HTTPS] server is runing at port " + httpsPORT));
}


//connects to database
mongoose.connect(mongoDBSRV, {
    useNewUrlParser:      true,
    useUnifiedTopology:   true
}).then(() =>[
    log(success("[READY] Connected to the database!"))
]).catch((err) =>{
    log(err);
});




//Log out Tracker
const logoutTimerMap = new Map();
const logoutTimerInMins = 15; //15 mins
const cooldownAmount = (logoutTimerInMins)* 60000;//hours 36000000
const minutes = 1;
const the_interval = minutes * 60000;
setInterval(function() {

    //log (`Map size: ${logoutTimerMap.size}`);
    logoutTimerMap.forEach(async function(value, key) {
        if((Date.now()-value) > cooldownAmount){
            await remove.removeFile(key);
        }else{
            //log("its okay")
        }
    })

}, the_interval);


//run when server starts
freshStart.removeCurrentUsers();


/************************************************Main Route************************************************/
app.get('/api', async function (req, res){
    let data;

    req.headers.hasOwnProperty("data") ? data = JSON.parse(req.headers.data) : data = false;
    //if (process.env.dev == "true") { req.body.hasOwnProperty("data") ? data = req.body.data : data = false; }
    if(!data.hasOwnProperty("function")) { return; }
    console.log(`data: \n${util.inspect(data, false, null,)}`);
    console.log(data.account);

    //adds account to a map if not logging out
    if(data.function != "logout"){
        logoutTimerMap.set(data.account, Date.now());
    }else{
        logoutTimerMap.has(data.account) ? logoutTimerMap.delete(data.account) : log("Account was not in Map");
    }

    //gets desired data
    res.json(await getFunction.functionType(data));
});


module.exports = { logoutTimerMap }