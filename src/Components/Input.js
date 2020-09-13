import React from "react";
import { Form, InputGroup, FormControl } from "react-bootstrap";
import "../scss/customInput.scss";

export default class CustomInput extends React.Component {
  constructor(props) {
    super(props);
    //context binds
    this.inputHandler = this.inputHandler.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.sendHandler = this.sendHandler.bind(this);
    //
    this.state = {
      message: "",
    };
    this.inputField = React.createRef();
  }
  //
  inputHandler(event) {
    event.persist();
    this.setState({ message: event.target.value });
  }
  //
  keyPressed(event) {
    //Enter pressed
    if (event.keyCode == 13) {
      event.preventDefault();
      if (this.state.message.length > 0) {
        this.props.enterHandler(this.state.message);
        event.target.value = "";
        this.setState({ message: "" }); //update state
      }
    }
  }
  //
  sendHandler() {
    if (this.state.message.length > 0) {
      this.inputField.current.value = ""; // clean inputfield
      this.props.enterHandler(this.state.message); //send its value to the server
      this.setState({ message: "" }); //update state
    }
  }
  render() {
    return (
      <React.Fragment>
        <InputGroup className="mb-2 py-2">
          <FormControl
            ref={this.inputField}
            className="formControlMessage"
            type="text"
            placeholder={this.props.inputPlaceHolder}
            onChange={this.inputHandler}
            onKeyDown={this.keyPressed}
            value={this.state.message}
          />

          <InputGroup.Append
            className="sendMessageButton"
            onClick={this.sendHandler}
          >
            <InputGroup.Text>{this.props.buttonName}</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </React.Fragment>
    );
  }
}
