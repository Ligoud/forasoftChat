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
    //bind context
    this.addChannel = this.addChannel.bind(this);
    this.clickOnChannel = this.clickOnChannel.bind(this);
    //
    this.state = {
      channelList: [],
    };
  }
  createNewChannel(channelName) {
    //
    OwnSocket.emitAddNewChannel(channelName);
  }
  connectToChannel(channelid) {
    OwnSocket.emitConnectToChannel(channelid);
  }
  addChannel(channelData) {
    this.setState((prev) => ({
      channelList: [
        ...prev.channelList,
        <Row
          className="chatRoom"
          data-channelid={channelData.channelId}
          data-channelname={channelData.channelName}
          key={channelData.channelId}
          onClick={this.clickOnChannel}
        >
          <Col md={12}>
            <span>{channelData.channelName}</span>
          </Col>
        </Row>,
      ],
    }));
  }
  clickOnChannel(event) {
    this.props.changeChat(
      event.currentTarget.getAttribute("data-channelid"),
      event.currentTarget.getAttribute("data-channelname")
    );
  }
  componentDidMount() {
    OwnSocket.newChannelListener(this.addChannel);
    OwnSocket.loadChannelsListener(this.addChannel);
    OwnSocket.emitReadyToLoadChannelsState();
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
                      enterHandler={this.createNewChannel}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
        <Row className="connectToRoom">
          <Col md={12} className="px-0 mb-0">
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Connect to chat room
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <CustomInput
                      inputPlaceHolder="Channel link"
                      buttonName="Connect"
                      enterHandler={this.connectToChannel}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
        <Row className="lineBorder">
          <Col md={12}></Col>
        </Row>
        {this.state.channelList}
      </div>
    );
  }
}
