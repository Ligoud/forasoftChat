import React from "react";
//
import "../scss/app.scss";
//bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//
import ChatBody from "./ChatBody";
import AsideChat from "./AsideChats";
import UsersPanel from "./chatUsersPanel";
//
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    //
    this.chooseChatChannel = this.chooseChatChannel.bind(this);
    //
    this.state = {
      currentChat: { chatid: "generalchatid", chatname: "General Chat" },
    };
  }
  //chnages current chat global state
  chooseChatChannel(channelId, channelName) {
    // console.log("changing chat");
    this.setState({
      currentChat: { chatid: channelId, chatname: channelName },
    });
  }
  render() {
    return (
      <Container fluid className="h-100">
        <Row className="main">
          <Col md={3} className="aside hideScrollBar">
            <AsideChat
              credentials={this.props.credentials}
              changeChat={this.chooseChatChannel}
            />
          </Col>
          <Col md={6} className="middlePanel mx-1">
            <ChatBody
              credentials={this.props.credentials}
              currentChat={this.state.currentChat}
            />
          </Col>
          <Col md={2}>
            <UsersPanel
              chatid={this.state.currentChat.chatid}
              key={this.state.currentChat.chatid}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
