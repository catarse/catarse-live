console.log("Loading client-side JS...");
var socket = io('http://localhost:5000');
socket.on('news', function (data) {
  console.log(data);
});
