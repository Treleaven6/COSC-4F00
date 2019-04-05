"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import ForgotPassword from "./ForgotPassword.js";
import Results from "../ResultsTesting/Results.js";
//import styles_CSSINJS from '../js/CSS_IN_JS_EXAMPLE.js';

// the Login screen
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.setWarning = this.setWarning.bind(this);
    this.state = {
      username: "",
      password: "",
      file: null,
      rid: null,
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        testresults: false
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
      const response = yield fetch("./api.php/login/" + username + "/" + password);
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = yield response.json();
      if (!Array.isArray(body)) throw Error("bad response: " + body);
      return body;
    })();
  }

  onBack() {
    this.setState({
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        testresults: false
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
        testresults: false
      }
    });
  }

  setWarning(str) {
    this.setState({
      warning: str
    });
  }

  handleFileSelect(e) {
    e.preventDefault();
    let file = e.target.files;

    if (file) {
      this.setState({
        file: file
      });
    } else {
      console.log("no file");
    }
  }

  handleUpload(e) {
    e.preventDefault();
    if (this.state.file === null) {
      return;
    }

    const path1 = "./api.php/upload/4/6/000000";
    this.getBase64(this.state.file[0], result => {
      axios.post(path1, encodeURIComponent(result)).then(res1 => {
        const path2 = "./api.php/send/4/6";
        axios.post(path2).then(res2 => {
          this.setState({
            rid: res2.data.rid,
            isVisible: {
              warn: false,
              login: false,
              forgotPassword: false,
              testresults: true
            }
          });
          //console.log(res2.data);
        });
      });
    });
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  render() {
    let display;

    if (this.state.isVisible["forgotPassword"]) {
      display = React.createElement(ForgotPassword, { goBack: this.onBack });
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
        })
      );
    }

    let testresults = null;
    if (this.state.isVisible["testresults"]) {
      testresults = React.createElement(Results, { rid: this.state.rid });
    }

    // <div style={styles_CSSINJS.CSSDemo_CSSInJS}>
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "MOCD"
      ),
      display,
      React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          null,
          "TESTING"
        ),
        React.createElement(
          "form",
          null,
          React.createElement("input", { type: "file", onChange: this.handleFileSelect, accept: ".zip" }),
          React.createElement("input", { type: "button", value: "Upload", onClick: e => this.handleUpload(e) })
        ),
        testresults
      )
    );
  }
}