const firebase = require('firebase-admin');
const cricketStats = require('./../../assets/cricket/players/stats/cricket-players');

const serviceAccount = require('./firebase-sa.json');

firebase.initializeApp({
 credential: firebase.credential.cert(serviceAccount)
});


const db = firebase.firestore(); 

// One time data setup
// const batch = db.batch();
// cricketStats.forEach((doc) => {
//     var docRef = db.collection('cricket-stats').doc(`${doc.TMID}`); 
//     batch.set(docRef, doc);
//   });

// batch.commit();



module.exports ={
    db
}