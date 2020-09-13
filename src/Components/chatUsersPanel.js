import React from "react";
import { Col, Row } from "react-bootstrap";
//
import OwnSocket from "../logic/socket";
//
import "../scss/userPanel.scss";

export default class UsersPanel extends React.Component {
  constructor(props) {
    super(props);
    //
    this.updateUsersList = this.updateUsersList.bind(this);
    this.updateActivityStateInPanel = this.updateActivityStateInPanel.bind(
      this
    );
    this.drawUserList = this.drawUserList.bind(this);
    //
    this.state = {
      userList: [],
    };
    //
  }
  drawUserList() {
    let res = [];
    this.state.userList.forEach((el) => {
      res.push(
        <li
          className={`list-group-item list-group-item-${
            el.isActive ? "secondary" : "light"
          }`}
          key={el.userid}
          title={el.isActive ? "Now online" : "Now inactive"}
        >
          {el.username}
        </li>
      );
    });
    return res;
  }
  //set whole list of users
  updateUsersList(usersList) {
    this.setState({ userList: usersList });
  }
  //changes active state on list
  updateActivityStateInPanel(activeUsers) {
    let res = [...this.state.userList];
    res = res.map((el) => {
      if (activeUsers[el.userid]) el.isActive = true;
      else el.isActive = false;
      return el;
    });
    // console.log(activeUsers);
    this.setState({ userList: res });
  }
  componentDidMount() {
    OwnSocket.loadActiveUsers(this.props.chatid);
    OwnSocket.usersPanelListener(this.updateUsersList);
    OwnSocket.needUpdateListener(this.props.chatid);
    OwnSocket.updateActiveUsers(this.updateActivityStateInPanel);
  }
  render() {
    let renderList = this.drawUserList(this.state.userList);

    return (
      <React.Fragment>
        <Row>
          <Col xs={12} className="panelHeader">
            <span>
              <h4>Users on channel</h4>
            </span>
          </Col>
        </Row>
        <Row className="usersPanel">
          <Col xs={12}>
            <ul className="list-group ">{renderList}</ul>
          </Col>
        </Row>
        <Row className="streamPanel">
          <Col xs={12}></Col>
        </Row>
      </React.Fragment>
    );
  }
}
