const { VjGame } = require("./lib/VjGame");
const logger = require('./lib/logger');
const { cricketQuestions } = require('./data/cricket-metadata');
const stats = require('./assets/cricket/players/stats/cricket-players');

//TODO
// 3rd round auto move game never stops issue
// Economy undefined is greater than any issue
// unable to restart game from client once game finished

function setupGames(io, socket) {

  let roomSize = 2;
  logger.success('***************** Setting up new connection ***************')
  /***
   * args = {
   *    availableCards: [],
   *    move: null
   *  }
   */
  // Auto Move logic for a client
  /**
   * gameState is for a single client
   * @param {*} gameState  a game state for a client which got timed out
   * @param {*} round round for which it got timed out
   * @returns 
   */
  const updateGameStateOnTimeout = (state, clientId, round, roundInfo) => {
    const recommendedMove = roundInfo.recommendedMove;
    state.move = { ...state.move, [round]: state.availableCards[recommendedMove[clientId]] };
    delete state.availableCards[recommendedMove[clientId]];
    return state;
  }

  /**
   * Modify State according to winner
   * @param {*} state Game State of all clients
   * @param {*} round Current Round
   * @returns Return clients array if it is final winner otherwise return undefined or false
   */
  const verifyWinState = (state, round, roundInfo) => {
    const clients = Object.keys(state);
    const roundWinner = getRoundWinner(state, clients, round, roundInfo);
    if (!state[clients[0]]['result']) {
      state[clients[0]]['result'] = {};
    }
    if (!state[clients[1]]['result']) {
      state[clients[1]]['result'] = {};
    }
    if (!roundWinner) {
      return false;
    } else if (roundWinner.length === 2) {
      state[clients[0]]['result'][round] = 'T';
      state[clients[1]]['result'][round] = 'T';
    } else {
      const anotherClient = clients.find(client => client !== roundWinner[0])
      state[roundWinner[0]]['result'][round] = 'W';
      state[anotherClient]['result'][round] = 'L';
    }
    return getFinalWinner(state, clients[0], clients[1], round);
  }

  const getRoundWinner = (state, clients, round, roundInfo) => {
    if (roundInfo && roundInfo.question && state[clients[0]]['move'] && state[clients[1]]['move'] && state[clients[0]]['move'][round] && state[clients[1]]['move'][round]) {
      if (getScore(state[clients[0]]['move'][round], roundInfo) > getScore(state[clients[1]]['move'][round], roundInfo)) {
        return [clients[0]]
      } else if (getScore(state[clients[0]]['move'][round], roundInfo) < getScore(state[clients[1]]['move'][round], roundInfo)) {
        return [clients[1]]
      } else {
        return clients;
      }
    } else {
      return undefined;
    }
  }

  const getFinalWinner = (state, client1, client2, round) => {
    if (round <= 3 && round > 1 &&
      state[client1].result &&
      state[client2].result &&
      state[client1]['move'] &&
      state[client2]['move'] &&
      state[client1]['move'][round] &&
      state[client1]['move'][round]
    ) {
      const client1Result = Object.values(state[client1].result).filter(round => round === 'W').length;
      const client2Result = Object.values(state[client2].result).filter(round => round === 'W').length;
      if (client1Result === 2 || (round === 3 && client1Result > client2Result)) {
        return [client1];
      } else if (client2Result === 2 || (round === 3 && client1Result < client2Result)) {
        return [client2];
      } else if (round === 3 && client1Result === client2Result) {
        return [client1, client2];
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  const getScore = (tmId, roundInfo) => {
    const card = stats.find(player => String(player.TMID) === String(tmId));
    if (roundInfo.question) {
      let score = card[Object.keys(roundInfo.question)[0]];
      if(!score) {
        score = '';
      }
      const quesKey = Object.keys(roundInfo.question)[0];
      if (quesKey === 'Econ') {
        return -score;
      }
      if (quesKey === 'HighestScore') {
        return score.replace('*', '');
      }
      if (quesKey === 'BBM') {
        const wr = score.split('/');
        return wr[0] ? wr[0]*1000 : 0 - wr[1] ? wr[1] : 0;
      }
      return Number(score);
    }
  }

  const modifyRoundInfo = (state, roundInfo) => {
    const random = Math.floor(Math.random() * 12);
    const fields = Object.keys(cricketQuestions);
    const randomField = fields[random];
    roundInfo['question'] = {
      [randomField]: cricketQuestions[randomField]
    }
    updateRecommendedMove(state, roundInfo)
  }

  const updateRecommendedMove = (state, roundInfo) => {
    const clientIds = Object.keys(state);
    const recommendedMove = {};
    for(let id of clientIds) {
      const cards = state[id].availableCards;
      //flip object and covert tmid to score
      //check for max score
      let maxScore = -1000;
      const flipped = flipObject(cards, (tmid) => { 
         let score = getScore(tmid, roundInfo);
         if(score > maxScore) {
          maxScore = score;
         }
         return getScore(tmid, roundInfo)
      });
      recommendedMove[id] = flipped[maxScore];
    }
    roundInfo['recommendedMove'] = recommendedMove;
  }

  const flipObject = (obj, valueModifier) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [valueModifier ? valueModifier(value) : value, key]));

  new VjGame(io, socket,
    {
      roomSize: 2,
      name: 'cricket',
      updateGameStateOnTimeout,
      verifyWinState,
      modifyRoundInfo,
      timePerRound: 15000,
      moveType: 'ALL'
    }
  );
}

module.exports = {
  setupGames
}