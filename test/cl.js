// set-up a connection between the client and the server
const io = require("socket.io-client");

var socket = io.connect("http://localhost:3030/");

// let's assume that the client page, once rendered, knows what room it wants to join
var room = "abc123";

socket.emit("room", room);
socket.on("ready", () => {
  console.log("inready");
  socket.emit("go");
});
socket.on("message", function (data) {
  console.log("Incoming message:", data);
});
