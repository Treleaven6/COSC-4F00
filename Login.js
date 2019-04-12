"use strict";

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
        testresults: false,
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

  onBack() {
    this.setState({
      isVisible: {
        warn: false,
        login: true,
        forgotPassword: false,
        testresults: false,
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
        testresults: false,
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
              testresults: true,
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
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

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
      testresults = <Results rid={this.state.rid}/>;
    }



    const Title = {
      fontSize:'60px',
      textAlign: 'center',
      fontFamily: "MarkPro Medium"
    };

    const TitleT = {
      fontSize:'50px',
      textAlign: 'center',
      fontFamily: "MarkPro Medium"
    };

    const div = { 
      width: 400,
      alignSelf: "text-center",
      borderWidth: 3,
      borderColor: "red",
      borderStyle: "dashed",
      textAlign: 'text-center',
    }

    // <div style={styles_CSSINJS.CSSDemo_CSSInJS}>
    return (
      <div className=" text-right">
        <br></br> 
        <br></br>
        <h1 style = {Title}> Measurement Of Code Duplication</h1>
        {display}
        <br></br> 
        
        
        <div  classname = "text-center" style = {div}> 
        <h3 style = {TitleT} >TESTING</h3>
          <form >
          <input type="file" onChange={this.handleFileSelect} accept=".zip" />
          <input type="button" value="Upload" onClick={e => this.handleUpload(e)} />
          </form>
          {testresults}
          </div>
        </div>
    );
  }
}
