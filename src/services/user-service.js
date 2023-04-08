const { db } = require('./firebase/initialize');
const { getInitialCricketCards } = require('./cricket-service');

const createUserIfNotExists = async (id, userData) => {
    const user = await getUser(id);
    if (!user) {
        const userCol = db.collection('users');
        const initialCards = getInitialCricketCards();
        try {
            await userCol.doc(id).set({
                ...userData,
                games: {
                    cricket: initialCards
                }
            })
        } catch (err) {
            console.log('Error creating user - ', id);
        }
    }
}

const getUser = async (id) => {
    let doc = null;
    try {
        doc = await db.collection('users').doc(id).get();
    } catch (err) {
        console.log('Unable to fetch user - ', id);
    }
    return doc ? doc.data() : undefined;
}

const updateUserCricketState = async (id, gameState) => {
    try {
        await db.collection('users').doc(id).update({
            'games.cricket' : {
                backupCards: gameState.backupCards,
                playingCards: gameState.playingCards
            }
        });
    } catch (err) {
        console.log('Unable to save user - ', id);
    }
}


const updateGameCricket = async (winner, loser, cardName) => {
    let loserCards = loser.teamCards;
    let winnerCardId = loserCards[cardName];
    delete loserCards[cardName];
    try {

        await db.collection('users').doc(loser.id).update({
            'games.cricket.playingCards': loserCards
        })
        const winUser = await getUser(winner.id);
        const backupCards = winUser.games.cricket.backupCards;
        if(backupCards[winnerCardId]){
            backupCards[winnerCardId].count = backupCards[winnerCardId].count + 1;
        } else {
            backupCards[winnerCardId] = {
                count: 1
            }
        }
        await db.collection('users').doc(winner.id).update({
            'games.cricket.backupCards': backupCards
        })
    } catch(error) {
        console.log('Unable to update game state:', error);
    }

}

module.exports = {
    createUserIfNotExists,
    getUser,
    updateGameCricket,
    updateUserCricketState
}