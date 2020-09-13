const Route = require("./Route");

class MessageRoute extends Route {
  onMessage(data, socket) {
    //async
    this.myDb.addRow(
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
    this.server.to(data.channelid).emit("broadcastMessage", resultObj);
  }
  async onLoadMessages(data, socket) {
    let messages = await this.myDb.getChannelMessages(data.channelid);
    messages = messages.map((el) => {
      return {
        from: { username: el.username, userid: el.userid },
        isMe: false,
        ...el,
      };
    });
    socket.emit("load messages", messages);
  }
}

module.exports.MessageRoute = MessageRoute;
