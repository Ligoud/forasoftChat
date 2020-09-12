import React from "react";

//custom components
import Chat from "./Components/Chat";
import Auth from "./Components/Auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    //
    this.setCredentials = this.setCredentials.bind(this);
    //
    this.state = {
      isLoggedIn: false,
      credentials: {},
    };
  }
  //set credentials to state. optional: add localstorage here
  setCredentials(cred) {
    this.setState({ isLoggedIn: true, credentials: cred });
  }
  render() {
    let content = "";
    if (this.state.isLoggedIn)
      content = <Chat credentials={this.state.credentials} />;
    else content = <Auth setCredentials={this.setCredentials} />;
    return <React.Fragment>{content}</React.Fragment>;
  }
}
