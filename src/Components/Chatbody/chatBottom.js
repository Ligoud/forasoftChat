import React from "react";
import { Col, Row } from "react-bootstrap";
import OwnSocket from "../../logic/socket";
import CustomInput from "../Input";

export default class BottomChat extends React.Component {
  constructor(props) {
    super(props);
    this.onEnterInputHandler = this.onEnterInputHandler.bind(this);
  }
  onEnterInputHandler(message) {
    OwnSocket.emitSendMessage(this.props.chatId, message);
  }
  render() {
    return (
      <React.Fragment>
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
