var logger = require('morgan');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var pg = require('pg');
var channel_name = 'new_paid_contributions';
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};

app.use(express.static('public', options));
app.use(logger('short'));

app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});
server.listen(app.get('port'));

var client = new pg.Client(process.env.DATABASE_URL);
client.connect(function(err) {
 if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.on('notification', function(msg) {
    if(msg.channel !== channel_name) return;
    console.log('Refreshing view');
    //client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "1".statistics;')
    console.log('Broadcasting notification: ', msg);
    io.of('/').sockets.forEach(function(socket){
      socket.emit(channel_name, msg);
    });
  });
  client.query("LISTEN " + channel_name);
});

io.on('connection', function (socket) {
  console.log('Open websocket');
  socket.emit('connected', { hello: 'world' });
});
