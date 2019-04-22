"use strict";


import ForgotPassword from "./ForgotPassword.js";
import ResultsLanding from "../ResultsTesting/ResultsLanding.js";
//import sty from "../js/LoginStyle.js";

// the Login screen
export default class Login extends React.Component {
  // constructor
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
      rid: false,
      testResults: null,
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        testresults: false
      },
      warning: ""
    };
  }

  // this is how React does input fields
  updateUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  // this is how React does input fields
  updatePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  // call the api to determine if allowed,
  // inform parent (App) if so
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
        if (res.length === 0) {
          console.log("bad login");
        } else if (res.length > 1) {
          throw Error("Duplicate keys!");
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

  // call the api to see if account exists
  async callApi(username, password) {
    const response = await fetch(
      "./api.php/login/" + username + "/" + password
    );
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    if (!Array.isArray(body)) throw Error("bad response: " + body);
    return body;
  }

  // return to the default login screen
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

  // show the forgot password component
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

  // set the warning string
  setWarning(str) {
    this.setState({
      warning: str
    });
  }

  // update state, used for testing
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

  // upload a zip for testing
  async handleUpload(e) {
    e.preventDefault();
    if (this.state.file === null) {
      return;
    }
    
    const path1 = "./api.php/uploadtest/4/6/" + encodeURIComponent(this.state.file[0].name.split(".")[0]);
    this.getBase64(this.state.file[0], result => {
      axios.post(path1, encodeURIComponent(result)).then(res1 => {
        //console.log(res1.data)
        this.setState({
          isVisible: {
            warn: false,
            login: false,
            forgotPassword: false,
            testresults: true,
          }
        });
        const path2 = "./api.php/send/4/6";
        axios.post(path2).then(res2 => {
          console.log(res2.data);
          //res2.data.rid,
          this.setState({
            rid: true,
            testResults: res2.data
          });
        });
      });
    }); 
  }

  // convert data to base64
  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

  // display
  render() {
    let display;

    if (this.state.isVisible["forgotPassword"]) {
      display = <ForgotPassword goBack={this.onBack} />;
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
        </form>
      );
    }

    let testresults = null;
    if (this.state.isVisible["testresults"]) {
      testresults = (
        <ResultsLanding
          rid={this.state.rid}
          testResults={this.state.testResults}
        />
      );
    } else {
      testresults=(
          <form>
            <input type="file" onChange={this.handleFileSelect} accept=".zip" />
            <input
              type="button"
              value="Upload"
              onClick={e => this.handleUpload(e)}
            />
          </form>
      );
    }

    // <div style={sty.testing}>
    return (
      <div>
        <h1>MOCD</h1>
        {display}
        <div>
          <h3>TESTING</h3>
          
          {testresults}
        </div>
      </div>
    );
  }
}
