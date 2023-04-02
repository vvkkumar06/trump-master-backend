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


const updateUser = () => {

}

module.exports = {
    createUserIfNotExists,
    getUser
}