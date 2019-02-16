import React, { Component } from "react";
import { CreateAccount } from "./ CreateAccount";
import { ForgotPassword } from "./ForgotPassword";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      username: "",
      password: "",
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        createAccount: false
      },
      warning: ""
    };
  }

  updateUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onLogin(e) {
    e.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      return;
    }

    this.callApi(
      encodeURI(this.state.username.trim()),
      encodeURI(this.state.password.trim())
    )
      .then(res => {
        if (Object.keys(res).length === 0) {
          // do nothing? display a little warning?
        } else if (Object.keys(res).length > 1) {
          console.log(
            "ERROR: duplicate credentials: " +
              this.state.username +
              ", " +
              this.state.password
          );
        } else {
          this.props.handleLogin(
            res[0].id,
            res[0].firstname,
            res[0].email,
            res[0].title
          );
        }
      })
      .catch(err => console.log(err));
  }

  callApi = async (username, password) => {
    const response = await fetch("/login/" + username + "/" + password);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  onBack() {
    this.setState({
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        createAccount: false
      }
    });
  }

  onForgotPassword(e) {
    e.preventDefault();
    this.setState({
      isVisible: {
        warn: false,
        login: false,
        forgotPassword: true,
        createAccount: false
      }
    });
  }

  onCreateAccount(e) {
    e.preventDefault();
    this.setState({
      isVisible: {
        warn: false,
        login: false,
        forgotPassword: false,
        createAccount: true
      }
    });
  }

  render() {
    let display;
    if (this.state.isVisible["forgotPassword"]) {
      display = <ForgotPassword goBack={this.onBack} />;
    } else if (this.state.isVisible["createAccount"]) {
      display = <CreateAccount goBack={this.onBack} />;
    } else {
      display = (
        <form>
          Username:{" "}
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={e => this.updateUsername(e)}
          />
          Password:{" "}
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={e => this.updatePassword(e)}
          />
          <input type="submit" value="Login" onClick={e => this.onLogin(e)} />
          <input
            type="button"
            value="Forgot Password"
            onClick={e => this.onForgotPassword(e)}
          />
          <input
            type="button"
            value="Create Account"
            onClick={e => this.onCreateAccount(e)}
          />
        </form>
      );
    }

    return (
      <div>
        <h1>MOCD</h1>
        {display}
      </div>
    );
  }
}
