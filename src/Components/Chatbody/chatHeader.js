import React from "react";
import { Badge, Col, Row } from "react-bootstrap";

export default class ChatHeader extends React.Component {
  copyToClipboard(event) {
    // ligoud
    navigator.clipboard.writeText(
      event.currentTarget.getAttribute("data-channelid")
    );
  }
  render() {
    return (
      <React.Fragment>
        <Row className="channelInfo">
          <Col md={12}>
            <Row>
              <Col md={9}>
                <div>
                  <h4>
                    <span>{this.props.currentChat.chatname}</span>
                  </h4>
                </div>
              </Col>
              <Col md={3}>
                <div
                  className="link"
                  data-channelid={this.props.currentChat.chatid}
                  onClick={this.copyToClipboard}
                >
                  <h4>
                    <Badge variant="secondary">Copy Link</Badge>
                  </h4>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
