import io from "socket.io-client";

// *  singleton like. (to prevent multiconnections to server from the components)
export default class OwnSocket {
  static socket = io(process.env.REACT_APP_SERVER_URI);
}
