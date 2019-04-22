'use strict';

import Login from "./Login/Login.js";
import Teacher from "./Landing/Teacher.js";
import Student from "./Landing/Student.js";

// Entry point of the website, decides whether to
// display the login page, a teacher account, or 
// a student account
class App extends React.Component {
  // constructor
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

  // change to a student or teacher account
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

  // return to login page
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

  // display
  render() {
    let display;
    if (this.state.isVisible["student"]) {
      display = React.createElement(Student, {
        handleLogout: this.logoutHandler,
        id: this.state.id,
        firstname: this.state.firstname,
        email: this.state.email
      });
    } else if (this.state.isVisible["teacher"]) {
      display = React.createElement(Teacher, {
        handleLogout: this.logoutHandler,
        id: this.state.id,
        firstname: this.state.firstname,
        email: this.state.email
      });
    } else {
      display = React.createElement(Login, { handleLogin: this.loginHandler });
    }

    return React.createElement(
      "div",
      null,
      display
    );
  }

}

// magic
let domContainer = document.querySelector('#react_goes_here');
ReactDOM.render(React.createElement(App, null), domContainer);