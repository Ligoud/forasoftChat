const io = require("socket.io");

const port = process.env.PORT || 3030;

const server = io.listen(port);
//
const { liteDb } = require("./db/database.js");
const myDb = new liteDb();

//case: connecting to the chat
server.on("connect", (socket) => {
  // console.log("socket connected");
  //case: receiving new message from user
  socket.on("message", (data) => {
    console.log(`[${socket.id}]: ${data.msg}`);
    socket.broadcast.emit("message", { from: socket.id, ...data });
  });
  //case: creating new channel
  socket.on("addChannel", (data) => {
    socket.emit("newChannel", data.channelName);
  });
  //

  function setCredentialsToSocket(socket, uuid, username) {
    if (uuid) {
      socket.id = uuid;
      socket.username = username;
    }
  }
  //case: trying to login
  socket.on("login", async (data) => {
    let uuid = await myDb.getLoggedInUserid(data.username, data.password);
    setCredentialsToSocket(socket, uuid, data.username);
    console.log(socket.id, socket.username);
    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "login",
    });
  });
  //case: register
  socket.on("register", async (data) => {
    let uuid = await myDb.registerNewUser(data.username, data.password);
    setCredentialsToSocket(socket, uuid, data.username);
    console.log(socket.id, socket.username);
    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "register",
    });
  });
});
