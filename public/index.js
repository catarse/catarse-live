console.log("Loading client-side JS...");
var socket = io('http://localhost:5000');
socket.on('connected', function (data) {
  console.log('Connected to websocket');
});

var statApp = document.getElementById('statistics');
m.mount(statApp, m.component(c.pages.LiveStatistics, {socket: socket}));
