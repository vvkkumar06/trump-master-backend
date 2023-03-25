module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log('connected:-', socket.id);

    socket.on('disconnect', () => {
      console.log('disconnected')
    });


    // console.log(roomSockets(io, 'cricket'));

    socket.on('cricket-new', (arg, callback) => {
      if (!availableCricketRooms(io)) {
        socket.join(`cricket-${socket.id}`)
      } else {
        const room = availableCricketRooms(io);
        socket.join(room);
        let roomDetails  = {room};
        io.to(room).timeout(5000).emit("start", roomDetails, (err, responses) => {
          if(!err) {
            if(responses.length === 2 && responses[0].id !== responses[1].id) {
              io.to(room).emit('pre-game', responses);
              io.on('game-loaded', (args,callback) =>{
                let question1 = '';
                let question2 = '';
                io.to(room).emit('question1', question1);
                io.on('answer1', (args, callback) =>{
                  //verify winner
                  //set winner on server
                  io.to(room).emit('question2', question2);
                  io.on('answer2',  (args, callback) => {
                    //verify if winner in first 2 round
                    io.to(room).emit('question3');
                    io.on('answer3', (args, callback) =>{
                      //decide winnner
                      let winnerData = {}
                      io.to(room).emit('show-winner', winnerData);
                      io.on('card-removed', (args, callback) => {
                        //update database
                      })
                    })
                  })
                } )
              })
            }
          }
        });
      }

      // socket.on('ready', (args, callback) => {
      //   gameStatus.push(socket.id);
      //   console.log('Ready: ', gameStatus);

      // });
      // console.log(availableCricketRooms(io));
    });


  });

  io.of("/").adapter.on("create-room", (room) => {
    // console.log(`room ${room} was created`);
  });

}


function findRooms(io) {
  const rooms = io.of("/").adapter.rooms;
  let roomNames = [];
  for (let i of rooms) {
    roomNames.push(i[0])
  }
  return roomNames;
}

function roomSockets(io, roomName) {
  return Array.from(io.of("/").adapter.rooms.get(roomName));
}

function availableCricketRooms(io) {
  const rooms = io.of("/").adapter.rooms;
  let roomName = undefined;
  for (let room of rooms) {
    if (room[0].startsWith('cricket-') && (room[1].size === 1)) {
      roomName = room[0];
      break;
    }
  }
  return roomName;
}
