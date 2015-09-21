console.log("Loading client-side JS...");
var socket = io('http://localhost:5000');
socket.on('connected', function (data) {
  console.log('Connected to websocket');
});
socket.on('new_contributions', function (data) {
  console.log('New notification:', data);
});
