'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import CreateAccount from "./CreateAccount.js";
import ForgotPassword from "./ForgotPassword.js";

export default class Login extends React.Component {
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

    this.callApi(encodeURI(this.state.username.trim()), encodeURI(this.state.password.trim())).then(res => {
      if (res.length === 0) {
        console.log("bad login");
      } else if (res.length > 1) {
        throw Error("Duplicate keys!");
      } else {
        this.props.handleLogin(res[0].id, res[0].firstname, res[0].email, res[0].title);
      }
    }).catch(err => console.log(err));
  }

  callApi(username, password) {
    return _asyncToGenerator(function* () {
      const response = yield fetch("http://localhost:8081/api.php/login/" + username + "/" + password);
      if (response.status === 500) throw Error("500, check php configuration");
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = yield response.json();
      if (!Array.isArray(body)) throw Error("bad response, check DB configuration");
      return body;
    })();
  }

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
      display = React.createElement(ForgotPassword, { goBack: this.onBack });
    } else if (this.state.isVisible["createAccount"]) {
      display = React.createElement(CreateAccount, { goBack: this.onBack });
    } else {
      display = React.createElement(
        "form",
        null,
        "Username:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "username",
          value: this.state.username,
          onChange: e => this.updateUsername(e)
        }),
        "Password:",
        " ",
        React.createElement("input", {
          type: "password",
          name: "password",
          value: this.state.password,
          onChange: e => this.updatePassword(e)
        }),
        React.createElement("input", { type: "submit", value: "Login", onClick: e => this.onLogin(e) }),
        React.createElement("input", {
          type: "button",
          value: "Forgot Password",
          onClick: e => this.onForgotPassword(e)
        }),
        React.createElement("input", {
          type: "button",
          value: "Create Account",
          onClick: e => this.onCreateAccount(e)
        })
      );
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "MOCD"
      ),
      display
    );
  }
}