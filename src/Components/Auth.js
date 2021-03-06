import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
//sass styles
import "../scss/auth.scss";
//my module with socket.io
import OwnSocket from "../logic/socket";

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    //bind context
    this.inputHandler = this.inputHandler.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    //
    this.state = {
      userName: "",
      password: "",
    };
  }
  inputHandler(event) {
    event.persist();
    //set state
    this.setState({
      [event.target.getAttribute("data-inputtype")]: event.target.value,
    });
  }
  //claim credentials and send to server
  register() {
    if (this.state.userName && this.state.password)
      OwnSocket.registerUser(this.state.userName, this.state.password);
    else console.log("not authed");
  }
  login() {
    if (this.state.userName && this.state.password)
      OwnSocket.loginUser(this.state.userName, this.state.password);
    else console.log("not authed");
  }
  componentDidMount() {
    OwnSocket.authListener(this.props.setCredentials);
  }
  render() {
    return (
      <Container fluid className="h-100">
        <Row className="h-50 pt-5">
          <Col md={{ span: 8, offset: 2 }} id="authCard">
            <Row>
              <Col md={12} className="d-flex justify-content-center">
                <h3>Авторизуйтесь</h3>
              </Col>
            </Row>
            <Row className="pt-5 h-50">
              <Col md={{ span: 8, offset: 2 }}>
                <Form className="authForm">
                  <Form.Group controlId="username">
                    <Form.Label>Your Username</Form.Label>
                    <Form.Control
                      data-inputtype="userName"
                      type="text"
                      placeholder="User123"
                      onChange={this.inputHandler}
                      value={this.state.userName}
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Your Password</Form.Label>
                    <Form.Control
                      data-inputtype="password"
                      type="password"
                      placeholder="UnexpectedlyHardPassword"
                      onChange={this.inputHandler}
                      value={this.state.password}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="buttonRow mt-5 pt-5">
              <Col md={{ span: 3, offset: 1 }} lg={{ span: 2, offset: 1 }}>
                <Button
                  variant="outline-secondary"
                  className="w-100 mw-100"
                  onClick={this.login}
                >
                  Log in
                </Button>
              </Col>
              <Col
                md={{ span: 3, offset: 4 }}
                lg={{ span: 2, offset: 6 }}
                onClick={this.register}
              >
                <Button variant="outline-secondary" className="w-100 mw-100">
                  Register
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
