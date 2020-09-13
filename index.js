const io = require("socket.io");

const port = process.env.PORT || 3030;

const server = io.listen(port);
//
const { liteDb } = require("./db/database.js");
const myDb = new liteDb();

//case: connecting to the chat
server.on("connect", (socket) => {
  /* #region  auth controls */
  //helper function
  async function userConnectedToChat(socket, uuid, username) {
    if (uuid) {
      socket.oldid = socket.id;
      socket.customid = uuid;
      socket.username = username;
    }
    // always join to generalchat
    socket.join("generalchatid");
    //join user to all stored channels
    let res = (await myDb.getAvailableChannels(socket.customid)).forEach(
      (el) => {
        socket.join(el.channelid);
      }
    );
    //case: client need to update info about users activity
    server.emit("updatePanel");
  }
  //case: trying to login
  socket.on("login", async (data) => {
    let uuid = await myDb.getLoggedInUserid(data.username, data.password);
    userConnectedToChat(socket, uuid, data.username);
    socket.join("generalchatid");

    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "login",
    });
  });
  //case: register
  socket.on("register", async (data) => {
    let uuid = await myDb.registerNewUser(data.username, data.password);
    userConnectedToChat(socket, uuid, data.username);
    //add general chat after register
    myDb.addChannel("General Chat", socket.customid);

    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "register",
    });
  });
  /* #endregion */

  /* #region  messages control */
  //
  //case: receiving new message from user
  socket.on("message", (data) => {
    console.log("rec mes from ", socket.oldid);

    myDb.addRow(
      "messages",
      socket.customid,
      socket.username,
      data.channelid,
      data.datetime,
      data.message
    );
    //isme - flag for client for positioning message
    let resultObj = {
      from: { username: socket.username, userid: socket.customid },
      isMe: false, //by default it is false. will be changed on client side
      ...data,
    };
    //send to all users. even to sender
    server.to(data.channelid).emit("broadcastMessage", resultObj);
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
  /* #endregion */

  /* #region  channels control */
  //get active users on current channel
  function getActiveUsers(channelid) {
    let socketids = server.sockets.adapter.rooms[channelid];
    let userInfo = {};
    for (let socketid in socketids.sockets) {
      let socketObject = server.sockets.connected[socketid];
      userInfo[socketObject.customid] = socketObject.username;
    }
    return userInfo;
  }

  //case: get all connected users for current channel
  socket.on("getConnectedUsers", async (data) => {
    //get all users on current channel
    let channelid = data.channelid;
    let allUsers = await myDb.getUsersOnChannel(channelid);
    let activeUsers = getActiveUsers(channelid);
    let result = [];
    //
    for (let i = 0; i < allUsers.length; i++) {
      let el = allUsers[i];
      let username = await myDb.getUserName(el.userid);
      // console.log(username);
      result.push({
        username: username,
        userid: el.userid,
        isActive: activeUsers[el.userid] ? true : false,
      });
    }
    socket.emit("loadUsersOnPanel", result);
  });
  //user requested active users list
  socket.on("updateActiveUsers", (data) => {
    let activeUsers = getActiveUsers(data.channelid);
    socket.emit("activeUsers", activeUsers);
  });
  //case: creating new channel
  socket.on("addChannel", (data) => {
    let channelid = myDb.addChannel(data.channelName, socket.customid);
    socket.emit("newChannel", {
      channelName: data.channelName,
      channelId: channelid,
    });
  });
  //case: loading channel for logged in user
  socket.on("readyToLoadChannels", async () => {
    let res = (await myDb.getAvailableChannels(socket.customid)).map((el) => ({
      channelName: el.channelname,
      channelId: el.channelid,
    }));
    socket.emit("loadChannels", res);
  });
  //case: connect to channel
  socket.on("connectToChannel", async (data) => {
    // add new user in channels table,
    let channelName = await myDb.addUserToChannel(
      data.channelid,
      socket.customid
    );
    //join current user to new Room
    socket.join(data.channelid);
    server.to(data.channelid).emit("fullUpdatePanel");
    //send info about new channel to user
    socket.emit("newChannel", {
      channelName: channelName,
      channelId: data.channelid,
    });
  });
  /* #endregion */
  //case: user disconnected
  socket.on("disconnect", () => {
    //case: client need to update info about users activity
    server.emit("updatePanel");
    console.log("disconnected user");
  });
});
