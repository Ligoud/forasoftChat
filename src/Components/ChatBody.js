import React from "react";
//bootstrap components
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
//my module with socket.io
import OwnSocket from "../logic/socket";
//sass styles
import "../scss/chatBody.scss";
//custom components
import CustomInput from "./Input";
//
class ChatBody extends React.Component {
  constructor(props) {
    super(props);
    //context binds
    this.onEnterInputHandler = this.onEnterInputHandler.bind(this);
    //initial state
    this.state = {
      message: "",
      incomingMessage: "",
    };
    //store ref to chat body
    this.chatBody = React.createRef();
  }

  addMessage() {}
  onEnterInputHandler(message) {
    OwnSocket.socket.emit("message", { msg: message });
  }
  componentDidMount() {
    OwnSocket.socket.on("message", (data) => {
      this.setState({ incomingMessage: `[${data.from}]: ${data.msg}` });
      // console.log(data);
    });
  }

  render() {
    return (
      <React.Fragment>
        <Row className="chatField">
          <Col md={12}></Col>
        </Row>
        <Row className="messageField">
          <Col md={12} className="px-0">
            <div className="messageInputBox">
              <CustomInput
                inputPlaceHolder="Your message"
                buttonName="Send"
                enterHandler={this.onEnterInputHandler}
              />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ChatBody;
