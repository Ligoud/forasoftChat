const io = require("socket.io");

const port = process.env.PORT || 3030;

const server = io.listen(port);
//
const { liteDb } = require("./db/database.js");
const myDb = new liteDb();
//
const { ChannelsRoute } = require("./socketRoutes/channelsRoute");
const { MessageRoute } = require("./socketRoutes/messageRoute");
const { AuthRoute } = require("./socketRoutes/authRoute");
//
const ChR = new ChannelsRoute(server, myDb);
const MsgR = new MessageRoute(server, myDb);
const AuthR = new AuthRoute(server, myDb);

//case: connecting to the chat
server.on("connect", (socket) => {
  /* #region  auth controls */
  //case: trying to login
  socket.on("login", async (data) => {
    AuthR.onLogin(data, socket);
  });
  //case: register
  socket.on("register", async (data) => {
    AuthR.onRegister(data, socket);
  });
  /* #endregion */

  /* #region  messages control */
  //
  //case: receiving new message from user
  socket.on("message", (data) => {
    MsgR.onMessage(data, socket);
  });
  //case: load message history to user client
  socket.on("load messages", async (data) => {
    MsgR.onLoadMessages(data, socket);
  });
  /* #endregion */

  /* #region  channels control */
  //case: get all connected users for current channel
  socket.on("getConnectedUsers", async (data) => {
    ChR.onConnectedUsers(data, socket);
  });
  //user requested active users list
  socket.on("updateActiveUsers", (data) => {
    ChR.onUpdateActiveUsers(data, socket);
  });
  //case: creating new channel
  socket.on("addChannel", (data) => {
    ChR.onAddChannel(data, socket);
  });
  //case: loading channel for logged in user
  socket.on("readyToLoadChannels", async () => {
    ChR.onReadyToLoadChannels(socket);
  });
  //case: connect to channel
  socket.on("connectToChannel", async (data) => {
    ChR.onConnectToChannel(data, socket);
  });
  /* #endregion */
  //case: user disconnected
  socket.on("disconnect", () => {
    //case: client need to update info about users activity
    server.emit("updatePanel");
  });
});
