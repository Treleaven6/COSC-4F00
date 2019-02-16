import React, { Component } from "react";
/*mport logo from './logo.svg';*/
import { Login } from "./Login/Login";
import { Teacher } from "./Landing/Teacher";
import { Student } from "./Landing/Student";
import "./App.css";

// https://reactjs.org/docs/add-react-to-a-website.html

class App extends Component {
  constructor(props) {
    super(props);
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.state = {
      id: "",
      firstname: "",
      email: "",
      role: "",
      isVisible: {
        login: true,
        teacher: false,
        student: false
      }
    };
  }

  /*
  // https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
  componentDidMount() {
     this.callApi()
     .then(res => this.setState({ response: res }))
     .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/teachingList/123456');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  */

  // res[0].id, res[0].firstname, res[0].email, res[0].title
  loginHandler(id, firstname, email, title) {
    this.setState({
      id: id,
      firstname: firstname,
      email: email,
      roll: title
    });

    if (title === "student") {
      this.setState({
        isVisible: {
          login: false,
          teacher: false,
          student: true
        }
      });
    } else if (title === "teacher") {
      this.setState({
        isVisible: {
          login: false,
          teacher: true,
          student: false
        }
      });
    }
  }

  logoutHandler() {
    console.log("logged out");
    this.setState({
      isVisible: {
        login: true,
        teacher: false,
        student: false
      }
    });
  }

  render() {
    let display;
    if (this.state.isVisible["student"]) {
      display = (
        <Student
          handleLogout={this.logoutHandler}
          id={this.state.id}
          firstname={this.state.firstname}
          email={this.state.email}
        />
      );
    } else if (this.state.isVisible["teacher"]) {
      display = (
        <Teacher
          handleLogout={this.logoutHandler}
          id={this.state.id}
          firstname={this.state.firstname}
          email={this.state.email}
        />
      );
    } else {
      display = <Login handleLogin={this.loginHandler} />;
    }

    return (
      <div className="App">
        {display}
        {/*
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    );
  }
}

export default App;
