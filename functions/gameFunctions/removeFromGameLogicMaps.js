/*
* removes the desired account from all skill maps
*/

const fishing = require (`./skills/fishing.js`);
const cooking = require (`./skills/cooking.js`);
const droppedItems = require (`./items/dropItem.js`);

function removeFromGameLogicMaps(currentAccount){

    fishing.removefisherMap(currentAccount);
    cooking.removeCookerMap(currentAccount);
    droppedItems.removeItemMap(currentAccount);

}

module.exports = { removeFromGameLogicMaps };