const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const blocked = new Schema({

    blockedIPS: {type: Array, require: true, default: ["test"]},
    blockedAccounts: {type: Array, require: true, default: ["test"]}
  
});

const blockedUsers = mongoose.model("Blocked", blocked);

module.exports = blockedUsers;
