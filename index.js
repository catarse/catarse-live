var logger = require('morgan'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    pg = require('pg'),
    channel_name = 'new_paid_contributions',
    options = {
      dotfiles: 'ignore',
      etag: false,
      extensions: ['htm', 'html'],
      index: false,
      maxAge: '1d',
      redirect: false,
      setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
      }
    },
    pgClient = new pg.Client(process.env.DATABASE_URL);

// APP BASIC CONFIG
app.use(express.static('public', options));
app.use(logger('short'));
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));

// APP ROUTES
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

server.listen(app.get('port'));

// POSTGRESQL CLIENT CONNECTION STUFF
pgClient.connect(function(err) {
 if(err) {
    return console.error('could not connect to postgres', err);
  }
  pgClient.on('notification', function(msg) {
    if (msg.channel !== channel_name) return;
    console.log('Refreshing view');
    //pgClient.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "1".statistics;')
    console.log('Broadcasting notification: ', msg);
    io.of('/').sockets.forEach(function(socket){
      socket.emit(channel_name, msg);
    });
  });
  pgClient.query("LISTEN " + channel_name);
});
