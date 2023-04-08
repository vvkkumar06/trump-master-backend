const firebase = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./firebase-sa.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'trump-master.appspot.com'
});

const bucket = getStorage().bucket();



const db = firebase.firestore();

let cricketStats = [];
const getCricketStats = async () => {
    if(!cricketStats.length) {
        let data = [];
        try {
            let snapshots = await db.collection('cricket-stats').get();
            data = snapshots.docs.map(item => item.data());
        } catch (err) {
            console.log('Unable to fetch stats - ', err);
        }
        return data;
    } else {
        return cricketStats;
    }
    
}

/**
 * NOTE: - DO NOT REMOVE BELOW CODE
 * Comment cricket stats from above before use
*/

// const cricketStats = require('./../../assets/cricket/players/stats/cricket-players');
// const getPlayerImage = async (clientPlayerId) => {
//     const file = bucket.file(`images/cricket/players/${clientPlayerId}.png`);
//     let url = [];
//     try {
//         url = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
//     } catch (error) {
//         console.log('Image not found:', clientPlayerId);
//     }
//     return url[0];
// }
// One time data setup
// const batch = db.batch();
// cricketStats.forEach(async (doc) => {
//     try {

//         doc.Image = await getPlayerImage(doc.ClientPlayerID);
//         var docRef = db.collection('cricket-stats').doc(`${doc.TMID}`);
//         batch.set(docRef, doc);
//     } catch(err){
//         console.log(err)
//     }
// });
// setTimeout(() => {
//     batch.commit();
// }, 10000)




module.exports = {
    db, getCricketStats
}