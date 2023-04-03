// module.exports = {
//   backupCards: {
//     1: {
//       count: 5,
//     },
//     5: {
//       count: 1
//     },
//     7: {
//       count: 2
//     },
//     112: {
//       count: 2
//     },
//     115: {
//       count: 1
//     },
//     199: {
//       count: 1
//     },
//     203: {
//       count: 4
//     },
//     15: {
//       count: 1
//     },
//     4: {
//       count: 2
//     }
//   },
//   playingCards: {
//   }
// }

const initializeData = () => {
  let backupCards = {};
  for(let i=0; i<5; i++) {
    let tmId = Math.floor(Math.random() * 490 + 1);
    backupCards[tmId] = { count: 1};
  }
  return { backupCards, playingCards: {}}
}
module.exports =  initializeData;