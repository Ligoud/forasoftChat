const io = require("socket.io-client");
// console.log(process.env.REACT_APP_SERVER_URI);
var socket = io("http://localhost:3030/");

socket.emit("testroom", "kek");
socket.on("testroomok", () => {
  socket.emit("testm", "hi cuckold");
});
socket.on("testback", (data) => {
  console.log(data);
});
