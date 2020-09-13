const Route = require("./Route");
class ChannelsRoute extends Route {
  //get active users on current channel
  getActiveUsers(channelid) {
    let socketids = this.server.sockets.adapter.rooms[channelid];
    let userInfo = {};
    if (socketids) {
      for (let socketid in socketids.sockets) {
        let socketObject = this.server.sockets.connected[socketid];
        userInfo[socketObject.customid] = socketObject.username;
      }
    }
    return userInfo;
  }
  async onConnectedUsers(data, socket) {
    //get all users on current channel
    let channelid = data.channelid;
    let allUsers = await this.myDb.getUsersOnChannel(channelid);
    let activeUsers = this.getActiveUsers(channelid);
    let result = [];
    //
    for (let i = 0; i < allUsers.length; i++) {
      let el = allUsers[i];
      if (el) {
        let username = await this.myDb.getUserName(el.userid);
        result.push({
          username: username,
          userid: el.userid,
          isActive: activeUsers[el.userid] ? true : false,
        });
      }
    }
    socket.emit("loadUsersOnPanel", result);
  }

  onUpdateActiveUsers(data, socket) {
    let activeUsers = this.getActiveUsers(data.channelid);
    socket.emit("activeUsers", activeUsers);
  }

  async onAddChannel(data, socket) {
    let channelid = await this.myDb.addChannel(
      data.channelName,
      socket.customid
    );
    socket.join(channelid);
    socket.emit("newChannel", {
      channelName: data.channelName,
      channelId: channelid,
    });
  }
  async onReadyToLoadChannels(socket) {
    let res = (await this.myDb.getAvailableChannels(socket.customid)).map(
      (el) => ({
        channelName: el.channelname,
        channelId: el.channelid,
      })
    );
    socket.emit("loadChannels", res);
  }
  async onConnectToChannel(data, socket) {
    // add new user in channels table,
    let channelName = await this.myDb.addUserToChannel(
      data.channelid,
      socket.customid
    );
    if (channelName) {
      //join current user to new Room
      socket.join(data.channelid);
      this.server.to(data.channelid).emit("fullUpdatePanel");
      //send info about new channel to user
      socket.emit("newChannel", {
        channelName: channelName,
        channelId: data.channelid,
      });
    } else {
      socket.emit("nosuchchannel", { channelid: data.channelid });
    }
  }
}

module.exports.ChannelsRoute = ChannelsRoute;
