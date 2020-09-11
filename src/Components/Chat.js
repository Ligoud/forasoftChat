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
//
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container fluid className="h-100">
        <Row className="main">
          <Col md={3} className="aside hideScrollBar">
            <AsideChat />
          </Col>
          <Col md={6}>
            <ChatBody />
          </Col>
        </Row>
      </Container>
    );
  }
}
