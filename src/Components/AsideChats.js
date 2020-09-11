import React from "react";
//bootstrap compoments
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
//sass styles
import "../scss/asideChat.scss";
//my module with socket.io
import OwnSocket from "../logic/socket";
//custom components
import CustomInput from "./Input";
//

export default class AsideChat extends React.Component {
  constructor(props) {
    super(props);
    this.addChannel = this.addChannel.bind(this);
    // this.channelList = React.createRef();
    this.state = {
      channelList: [],
    };
  }
  onEnterInputHandler(channelName) {
    //
    OwnSocket.socket.emit("addChannel", { channelName: channelName });
  }
  addChannel(channelName) {
    this.setState((prev) => ({
      channelList: [
        ...prev.channelList,
        <Row className="chatRoom">
          <Col md={12}>
            <span>{channelName}</span>
          </Col>
        </Row>,
      ],
    }));
  }
  componentDidMount() {
    OwnSocket.socket.on("newChannel", (data) => {
      console.log("received new cnahnel", data);
      this.addChannel(data);
    });
  }
  render() {
    return (
      <div id="channelWrapper">
        <Row className="createRoom">
          <Col md={12} className="px-0 mb-0">
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Create chat-channel
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <CustomInput
                      inputPlaceHolder="Channel name"
                      buttonName="Create"
                      enterHandler={this.onEnterInputHandler}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
        {/* <div className="channels"> */}
        <Row className="lineBorder">
          <Col md={12}></Col>
        </Row>
        {this.state.channelList}
        {/* </div> */}
      </div>
    );
  }
}
