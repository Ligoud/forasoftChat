import React from "react";
//sass styles
import "../scss/chatBody.scss";
//custom components
import ChatHeader from "./Chatbody/chatHeader";
import MessageField from "./Chatbody/messageField";
import ChatBottom from "./Chatbody/chatBottom";
//
class ChatBody extends React.Component {
  constructor(props) {
    super(props);
    //context binds
    //initial state
    this.state = {
      message: "",
      incomingMessage: "",
    };
    //store ref to chat body
    this.chatBody = React.createRef();
  }

  render() {
    return (
      <React.Fragment>
        <ChatHeader currentChat={this.props.currentChat} />
        <MessageField
          chatId={this.props.currentChat.chatid}
          key={this.props.currentChat.chatid}
        />
        <ChatBottom chatId={this.props.currentChat.chatid} />
      </React.Fragment>
    );
  }
}

export default ChatBody;
