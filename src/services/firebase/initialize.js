const firebase = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const cricketStats = require('./../../assets/cricket/players/stats/cricket-players');

const serviceAccount = require('./firebase-sa.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'trump-master.appspot.com'
});

const bucket = getStorage().bucket();

const getPlayerImage = async (tmid) => {
    const file = bucket.file(`images/cricket/players/${tmid}.png`);
    let url = [];
    try {
        url = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    } catch (error) {
        console.log('Image not found:', tmid);
    }
    return url[0];
}

const db = firebase.firestore();


/**
 * NOTE: - DO NOT REMOVE BELOW CODE
 */
// One time data setup
// const batch = db.batch();
// cricketStats.forEach(async (doc) => {
//     try {

//         doc.Image = await getPlayerImage(doc.TMID);
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
    db
}