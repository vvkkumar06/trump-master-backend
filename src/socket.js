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
        io.to(room).timeout(5000).emit("start", undefined, (err, responses) => {
          if(!err) {
            console.log(responses);
            if(responses.length === 2 && responses[0] !== responses[1]) {
              io.to(room).emit('question1', 'Strike Rate', (err, responses) => {
                //calcualte win loss and let client know who won and who loss
                
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
