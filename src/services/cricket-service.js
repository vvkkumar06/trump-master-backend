const { db } = require('./firebase/initialize');

const getInitialCricketCards = () => {
    let backupCards = {};
    for (let i = 0; i < 5; i++) {
        let tmId = Math.floor(Math.random() * 490 + 1);
        backupCards[tmId] = { count: 1 };
    }
    return { backupCards, playingCards: {} };
}


module.exports = {
    getInitialCricketCards
}