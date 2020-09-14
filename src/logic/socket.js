import io from "socket.io-client";
var socket = io(process.env.REACT_APP_SERVER_URI);
// *  singleton like. (to prevent multiconnections to server from the components)
export default class OwnSocket {
  //
  //Auth control
  //
  //register user
  static registerUser(username, password) {
    socket.emit("register", {
      username: username,
      password: password,
    });
  }
  //login user
  static loginUser(username, password) {
    socket.emit("login", {
      username: username,
      password: password,
    });
  }
  //receive resultat of auth
  static authListener(setCredentials) {
    socket.on("authorize", (data) => {
      // let { username, userid } = { ...data }

      let isLoginResponce = data.type === "login" ? true : false;
      // userid is actual id for logged in user
      if (isLoginResponce && data.userid) {
        delete data.type;
        socket.id = data.userid;
        setCredentials(data);
      }
      //user failed log in
      else if (isLoginResponce) {
        alert("Wrong credentials. Try again.");
      }
      //userid is actual id for new user
      else if (data.userid) {
        delete data.type;
        socket.id = data.userid;
        setCredentials(data);
      }
      //user failed register due to existing account
      else {
        alert("account already exist");
      }
    });
  }
  static getSocketId() {
    return socket.id;
  }
  static setSocketId(newId) {
    socket.id = newId;
  }
  //
  //channels control
  //
  //no such channel
  static forceNoSuchChannelAlert() {
    socket.on("nosuchchannel", (data) => {
      alert("No such channel: " + data.channelid);
    });
  }
  //trigger whenever new chat is added
  static newChannelListener(addChannel) {
    socket.on("newChannel", (data) => {
      addChannel(data);
    });
  }
  //loads all available chat channels.
  static loadChannelsListener(addChannel) {
    socket.on("loadChannels", (data) => {
      data.forEach((el) => {
        addChannel(el);
      });
    });
  }
  //trying to connect to new chat channel
  static emitConnectToChannel(channelId) {
    socket.emit("connectToChannel", { channelid: channelId });
  }
  //emits adding new channel
  static emitAddNewChannel(channelName) {
    socket.emit("addChannel", { channelName: channelName });
  }
  //emits signal that client ready to recevie channel list
  static emitReadyToLoadChannelsState() {
    socket.emit("readyToLoadChannels");
  }
  //
  //messages control
  //
  static receiveMessage(addMessage) {
    socket.on("broadcastMessage", (data) => {
      if (socket.id === data.from.userid) data.isMe = true;
      addMessage(data);
    });
  }
  static emitLoadMessages(channelid) {
    socket.emit("load messages", { channelid: channelid });
  }
  static loadMessagesListener(addMessage) {
    socket.on("load messages", (data) => {
      // console.log(data);
      data.forEach((el) => {
        if (socket.id === el.from.userid) el.isMe = true;

        addMessage(el);
      });
    });
  }
  static emitSendMessage(channelId, message) {
    console.log(channelId, socket.id);
    socket.emit("message", {
      channelid: channelId,
      message: message,
      datetime: new Date().toString(),
    });
  }
  //
  // active users panel control
  //
  //signal to server that client ready to load activeusers panel
  static loadActiveUsers(channelid) {
    //send signal instantly
    socket.emit("getConnectedUsers", { channelid: channelid });
    //waits for signal from server to full update userlist
    socket.on("fullUpdatePanel", () => {
      socket.emit("getConnectedUsers", { channelid: channelid });
    });
  }
  //receive all users panel
  static usersPanelListener(updateActiveUsersList) {
    socket.on("loadUsersOnPanel", (data) => {
      // console.log(data);
      updateActiveUsersList(data);
    });
  }
  //waits for signal from server to update userlist. (without db acces on server)
  static needUpdateListener(channelid) {
    socket.on("updatePanel", () => {
      console.log("forced to update panel");
      socket.emit("updateActiveUsers", { channelid: channelid });
    });
  }

  // receives ONLY active users to update info on panel
  static updateActiveUsers(updateActivityStateInPanel) {
    socket.on("activeUsers", (data) => {
      updateActivityStateInPanel(data);
    });
  }
  //
  //
  //
}
