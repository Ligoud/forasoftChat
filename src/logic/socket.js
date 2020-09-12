import io from "socket.io-client";

// *  singleton like. (to prevent multiconnections to server from the components)
export default class OwnSocket {
  static socket = io(process.env.REACT_APP_SERVER_URI);

  //channels control

  static newChannelListener(addChannel) {
    this.socket.on("newChannel", (data) => {
      addChannel(data);
    });
  }
  static loadChannelsListener(addChannel) {
    this.socket.on("loadChannels", (data) => {
      data.forEach((el) => {
        addChannel(el);
      });
    });
  }
  static emitConnectToChannel(channelId) {
    this.socket.emit("connect to channel", { channelid: channelId });
  }
  static emitAddNewChannel(channelName) {
    this.socket.emit("addChannel", { channelName: channelName });
  }
  static emitReadyToLoadChannelsState() {
    this.socket.emit("readyToLoadChannels");
  }

  //messages control
  static receiveMessage(addMessage) {
    this.socket.on("broadcast message", (data) => {
      if (this.socket.id === data.from.userid) data.isMe = true;
      addMessage(data);
    });
  }
  static emitLoadMessages(channelid) {
    this.socket.emit("load messages", { channelid: channelid });
  }
  static loadMessagesListener(addMessage) {
    this.socket.on("load messages", (data) => {
      // console.log(data);
      data.forEach((el) => {
        if (this.socket.id === el.from.userid) el.isMe = true;

        addMessage(el);
      });
    });
  }
  static emitSendMessage(channelId, message) {
    this.socket.emit("message", {
      channelid: channelId,
      message: message,
      datetime: new Date().toString(),
    });
  }
}
