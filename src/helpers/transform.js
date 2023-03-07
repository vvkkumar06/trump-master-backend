const _ = require('lodash');

const transformToCardData = (database, playersInfo) => {
  const db = _.cloneDeep(database);
  const playersData = _.cloneDeep(playersInfo);
  console.log(playersInfo.playingCards)
  let backupCards = [];

  db.backupCards.forEach((tmid) =>{
   let card = playersData.find(item => item.TMID == tmid);
   if(card) {
     backupCards.push(card);
   }
  });
  for(let key in db.playingCards) {
    let foundPlayer = playersData.find(item => item.TMID == db.playingCards[key]);
    db.playingCards[key] = foundPlayer ? foundPlayer : {}
  }
  return {
    backupCards,
    playingCards: db.playingCards
  }
}

module.exports = {
  transformToCardData
}