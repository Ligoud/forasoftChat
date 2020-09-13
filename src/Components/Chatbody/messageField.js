import React from "react";
import { Col, Row, Toast } from "react-bootstrap";
import OwnSocket from "../../logic/socket";

export default class MessageField extends React.Component {
  constructor(props) {
    super(props);
    //
    this.addMessage = this.addMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    //
    this.state = {
      messageList: [],
    };
    //
    this.messageField = React.createRef();
  }
  //message is object {channelId,from,datetime,message}
  addMessage(message) {
    //add message card only if proper channel selected
    if (this.props.chatId == message.channelid) {
      //offset  message
      let messageposLg = { span: 6, offset: 0 };
      let messageposDefault = { span: 8, offset: 0 };
      //if message from me
      if (message.isMe) {
        messageposLg.offset = 6;
        messageposDefault.offset = 4;
      }
      let datetime = new Date(message.datetime);
      let time = `${datetime.getHours()}:${datetime.getMinutes()}`;
      let shortDateTime =
        time +
        `\t ${datetime.getDate()}.${datetime.getMonth()}.${datetime.getFullYear()}`;
      this.setState((prev) => ({
        messageList: [
          ...prev.messageList,
          <Row key={message.datetime + message.message} className="my-2">
            <Col
              lg={messageposLg}
              xs={messageposDefault}
              className="messageRow w-100 d-flex justify-content-center"
            >
              <Toast style={{ minWidth: "250px" }}>
                <Toast.Header title={message.from.username}>
                  <strong className="mr-auto">{message.from.username}</strong>
                  <small title={shortDateTime}>{time}</small>
                </Toast.Header>
                <Toast.Body>{message.message}</Toast.Body>
              </Toast>
            </Col>
          </Row>,
        ],
      }));
    }
  }

  scrollToBottom() {
    this.messageField.current.scrollTo(
      0,
      this.messageField.current.scrollHeight
    );
  }
  componentDidMount() {
    OwnSocket.receiveMessage(this.addMessage);
    OwnSocket.emitLoadMessages(this.props.chatId);
    OwnSocket.loadMessagesListener(this.addMessage);
    //scroll messagefield
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <React.Fragment>
        <Row className="chatField hideScrollBar py-5" ref={this.messageField}>
          <Col md={12}>{this.state.messageList}</Col>
        </Row>
      </React.Fragment>
    );
  }
}
