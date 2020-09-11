import React from "react";

//custom components
import Chat from "./Components/Chat";
import Auth from "./Components/Auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }
  render() {
    let content = "";
    if (this.state.isLoggedIn) content = <Chat />;
    else content = <Auth />;
    return <React.Fragment>{content}</React.Fragment>;
  }
}
