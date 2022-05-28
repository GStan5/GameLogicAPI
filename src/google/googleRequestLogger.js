/*
* log request to a google excel document {time, ip, account, req.url, ?data
*/
const {google} = require('googleapis');
const { GoogleAuth } = require('google-auth-library');


async function googleSheetsWriter(access, req){

    let path = (req.url).substring(1);
    let data;
    req.headers.hasOwnProperty("data") ? data = JSON.parse(req.headers.data) : data = false;
    if(!data.hasOwnProperty("function")) { return; }

    let functionType;
    let account;
    let slayerSilver;
    let inventory;
    let bank;
    if (!data){
        functionType = "NA";
        account = "NA";
        slayerSilver = "NA";
        inventory = "NA";
        bank = "NA";
    }else{
        functionType = data.function;
        account = data.account;
        slayerSilver = data.slayersilver;
        inventory = data.inventory;
        bank = data.bank;
    }

    const auth = new GoogleAuth({

        keyFile: "./src/google/credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "1RqrxgVqmqsLSuL1TNev0B_URRIvHA9UvRw6FAjSUBhc";
    const metaData = await googleSheets.spreadsheets.get({
        auth, 
        spreadsheetId,
    })

    //get data
    const getRows = await googleSheets.spreadsheets.values.get({
        auth, 
        spreadsheetId,
        range: "Sheet1",
    })

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
    var dateTime = date+' '+time;
    //console.log(dateTime);

    //write data
    await googleSheets.spreadsheets.values.append({
        auth, 
        spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [
                [dateTime, access, req.ip, account, path, functionType, ]
            ]
        }
    })
}

module.exports = { googleSheetsWriter }


