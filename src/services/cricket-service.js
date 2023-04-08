const { db } = require('./firebase/initialize');

const getInitialCricketCards = () => {
    let backupCards = {};
    for (let i = 0; i < 5; i++) {
        let tmId = Math.floor(Math.random() * 490 + 1);
        backupCards[tmId] = { count: 1 };
    }
    return { backupCards, playingCards: {} };
}

const getCricketStats = async () => {
    let data = [];
    try {
        let snapshots = await db.collection('cricket-stats').get();
        data = snapshots.docs.map(item => item.data());
    } catch (err) {
        console.log('Unable to fetch stats - ', err);
    }
    return data;
}


module.exports = {
    getInitialCricketCards,
    getCricketStats
}