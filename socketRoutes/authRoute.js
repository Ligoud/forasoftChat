const Route = require("./Route");

class AuthRoute extends Route {
  //helper function
  async userConnectedToChat(socket, uuid, username) {
    if (uuid) {
      socket.oldid = socket.id;
      socket.customid = uuid;
      socket.username = username;
    }
    // always join to generalchat
    socket.join("generalchatid");
    //join user to all stored channels
    let res = (await this.myDb.getAvailableChannels(socket.customid)).forEach(
      (el) => {
        socket.join(el.channelid);
      }
    );
    //case: client need to update info about users activity
    socket.broadcast.emit("updatePanel");
  }

  async onLogin(data, socket) {
    let uuid = await this.myDb.getLoggedInUserid(data.username, data.password);
    this.userConnectedToChat(socket, uuid, data.username);
    socket.join("generalchatid");

    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "login",
    });
  }

  async onRegister(data, socket) {
    let uuid = await this.myDb.registerNewUser(data.username, data.password);
    this.userConnectedToChat(socket, uuid, data.username);
    //add general chat after register
    await this.myDb.addChannel(
      "General Chat",
      socket.customid,
      "generalchatid"
    );

    socket.emit("authorize", {
      userid: uuid,
      username: data.username,
      type: "register",
    });
  }
}

module.exports.AuthRoute = AuthRoute;
