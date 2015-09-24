console.log("Loading client-side JS...");
var socket = io('http://catarse-live.herokuapp.com');
socket.on('connected', function (data) {
  console.log('Connected to websocket');
});

var statApp = document.getElementById('statistics');
m.mount(statApp, m.component(c.pages.LiveStatistics, {socket: socket}));
