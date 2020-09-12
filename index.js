const io = require("socket.io");

const port = process.env.PORT || 3030;

const server = io.listen(port);
//
const { liteDb } = require("./db/database.js");
const myDb = new liteDb();

//case: connecting to the chat
server.on("connect", (socket) => {
  //
  //case: receiving new message from user
  socket.on("message", (data) => {
    //! add broadcast to room (not to all channels)
    myDb.addRow(
      "messages",
      socket.id,
      socket.username,
      data.channelId,
      data.datetime,
      data.message
    );
    //isme - flag for client for positioning message
    let resultObj = {
      from: { username: socket.username, userid: socket.id },
      isMe: false, //by default it is false. will be changed on client side
      ...data,
    };
    //send to all users.
    //! problem: broadcast not working properly (sends even to sender first time)
    socket.broadcast.emit("broadcast message", resultObj);
  });
  //case: load message history to user client
  socket.on("load messages", async (data) => {
    let messages = await myDb.getChannelMessages(data.channelid);
    messages = messages.map((el) => {
      return {
        from: { username: el.username, userid: el.userid },
        isMe: false,
        ...el,
      };
    });
    socket.emit("load messages", messages);
  });
  //case: creating new channel
  socket.on("addChannel", (data) => {
    let channelid = myDb.addChannel(data.channelName, socket.id);
    socket.emit("newChannel", {
      channelName: data.channelName,
      channelId: channelid,
    });
  });
  //case: loading channel for logged in user
  socket.on("readyToLoadChannels", async () => {
    let res = (await myDb.getAvailableChannels(socket.id)).map((el) => ({
      channelName: el.channelname,
      channelId: el.channelid,
    }));
    socket.emit("loadChannels", res);
  });
  //case: connect to channel
  socket.on("connect to channel", (data) => {
    //add new user in channels table,
    // let channelid = myDb.addChannel(data.channelName, socket.id);
    // socket.emit("newChannel", {
    //   channelName: data.channelName,
    //   channelId: channelid,
    // });
    //join this user to new Room
  });
  //helper function
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
    //add general chat after register
    myDb.addChannel("General Chat", socket.id, "generalchatid");

    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "register",
    });
  });
});
