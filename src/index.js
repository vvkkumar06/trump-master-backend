const express = require('express');
const path = require('path');
const cors  = require('cors');
const morgan = require('morgan');
const cricketRouter = require('./controllers/cricket-controller');


const app = express();
//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())
//Cricket Player Images
app.use('/images/cricket-players',express.static(path.resolve(__dirname, 'assets/cricket/players/images')));
app.use('/data/cricket/player-stats',express.static(path.resolve(__dirname, 'assets/cricket/players/stats')))


//routes
app.use('/api/cricket', cricketRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8080, (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('Listening on port: 8080')
  }
})