/*
* logs errors to google sheets
*/
const {google} = require('googleapis');
const { GoogleAuth } = require('google-auth-library');


async function googleSheetsWriterError(account, functionName, error){

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
        range: "Sheet2",
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
        range: "Sheet2",
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [
                [dateTime, account, functionName, error]
            ]
        }
    })
}

module.exports = { googleSheetsWriterError }


