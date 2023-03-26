const { VjGame } = require("./lib/VjGame");
const logger = require('./lib/logger');
const {cricketQuestions} = require('./data/cricket-metadata');
const stats = require('./assets/cricket/players/stats/cricket-players');



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
  const updateGameStateOnTimeout = (state, round) => {
    // const getRandomCard = state.availableCards[Math.floor(Math.random() * roomSize)];
    // state.move = { ...state.move, ...{ [round]: getRandomCard } };
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
      state[clients[0]]['result'] = [];
    }
    if (!state[clients[1]]['result']) {
      state[clients[1]]['result'] = [];
    }
    if (!roundWinner) {
      return false;
    } else if (roundWinner.length === 2) {
      state[clients[0]]['result'].push('T');
      state[clients[1]]['result'].push('T');
    } else {
      const anotherClient = clients.find(client => client !== roundWinner[0])
      state[roundWinner[0]]['result'].push('W');
      state[anotherClient]['result'].push('L');
    }
    return getFinalWinner(state, clients[0], clients[1], round);
  }

  const getRoundWinner = (state, clients, round, roundInfo) => {
    if (state[clients[0]]['move'] && state[clients[1]]['move'] && state[clients[0]]['move'][round] && state[clients[1]]['move'][round]) {
      if (getCardPropFromId(state[clients[0]]['move'][round], roundInfo) > getCardPropFromId(state[clients[1]]['move'][round], roundInfo)) {
        return [clients[0]]
      } else if (getCardPropFromId(state[clients[0]]['move'][round]) < getCardPropFromId(state[clients[1]]['move'][round])) {
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
      const client1Result = state[client1].result.filter(round => round === 'W').length;
      const client2Result = state[client2].result.filter(round => round === 'W').length;
      if(round === 2) {
        if(client1Result === 2) {
          return [client1];
        } else if(client2Result === 2){
          return [client2];
        }
      } else {
        if(client1Result === 1) {
          return [client1]
        } else if(client2Result === 1){
          return [client2]
        } else {
          return [client1, client2]
        }
      }
    }
    return undefined;
  }

  const getCardPropFromId = (value, roundInfo) => {
    const card = stats.find(player => String(player.TMID) === String(value));
    return card[Object.keys(roundInfo.question)[0]];
  }

  const modifyRoundInfo = (roundInfo) => {
    const random = Math.floor(Math.random()*13);
    const fields = Object.keys(cricketQuestions);
    const randomField = fields[random];
    roundInfo['question'] = {
        [randomField]: cricketQuestions[randomField]
      }

  }

  const cricketGame = new VjGame(io, socket,
    {
      roomSize: 2,
      name: 'cricket',
      updateGameStateOnTimeout,
      verifyWinState,
      modifyRoundInfo,
      timePerRound: 30000,
      moveType: 'ALL'
    }
  );
}

module.exports = {
  setupGames
}