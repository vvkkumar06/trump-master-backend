const express = require('express');
const path = require('path');
const cors  = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { createServer } =  require("http");
const cricketRouter = require('./controllers/cricket-controller');
const authRouter = require('./controllers/auth-controller');
const userRouter = require('./controllers/user-controller');
const {setupGames} = require('./setup');
require('./services/firebase/initialize');


const app = express();
//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Cricket Player Images
app.use('/images/cricket-players',express.static(path.resolve(__dirname, 'assets/cricket/players/images')));
app.use('/data/cricket/player-stats',express.static(path.resolve(__dirname, 'assets/cricket/players/stats')))


//routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cricket', cricketRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const httpServer = createServer(app);


const io = new Server(httpServer, {cors: {
  origin: "*",
}})

io.on('connection', (socket) => {
  console.log('connected:-', socket.id);
  setupGames(io, socket);
});

httpServer.listen(process.env.PORT || 8080);