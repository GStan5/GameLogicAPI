const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const accountSchema = new Schema({

    account: {type: String, require: true, unique: true},
    SlayerSilver: {type: Number, require: true, default: 0},
    Slayer: {type: Number, require: true, default: 0},
    slayerPoints: {type: Number, require: true, default: 0},
    inventory: {type: Array, require: true, default: [
        "x 1", "x 1", "x 1",  
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1", "x 1",
        "x 1", "x 1",
        "x 1", "x 1", 
    ]},
    bank: {type: Array, require: true, default: [
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1",  
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
        "x 1", "x 1", "x 1", "x 1", "x 1", 
    ]},
    bankSlots: {type: Number, require: true, default: 50},

    fishCooked: {type: Number, require: true, default: 0},
    
    blacklisted: {type: Boolean, require: true, default: false},
    

    currentLocationX: {type: Number, require: true, default: -9.5},
    currentLocationY: {type: Number, require: true, default: 0.5},
    timePlayed: {type: Number, require: true, default: 0.0},
    fishingLevel: {type: Number, require: true, default: 1},
    fishingXP: {type: Number, require: true, default: 0.0},
    cookingLevel: {type: Number, require: true, default: 1},
    cookingXP: {type: Number, require: true, default: 0.0},

  
});

const createAccount = mongoose.model("Account", accountSchema);

module.exports = createAccount;
