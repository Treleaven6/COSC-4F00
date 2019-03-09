'use strict';

import Login from "./Login/Login.js";
import Teacher from "./Landing/Teacher.js";
import Student from "./Landing/Student.js";

class App extends React.Component {
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
      <div>
        {display}
      </div>
    );
  }

}

let domContainer = document.querySelector('#react_goes_here');
ReactDOM.render(<App />, domContainer);