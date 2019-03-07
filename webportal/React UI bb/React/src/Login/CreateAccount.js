import React, { Component } from "react";

export class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      sid: "",
      is_teacher: false,
      warning: ""
    };
  }

  // holy shit this is rad
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onRequest(e) {
    e.preventDefault();
    // sanitize / check database
    // if good, send to parent
    if (this.state.email === '' || this.state.first_name === '' || this.state.last_name === '' || this.state.username === '' || this.state.sid === '') {
        return;
    }
    
    console.log(
      "request create account: " +
        this.state.email +
        ", " +
        this.state.first_name +
        ", " +
        this.state.last_name +
        ", " +
        this.state.username +
        ", " +
        this.state.sid +
        ", " +
        this.state.is_teacher
    );
    this.props.goBack();
    // if bad, display a little message
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  render() {
    return (
      <form>
        Email:{" "}
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={e => this.handleInputChange(e)}
        />
        First Name:{" "}
        <input
          type="text"
          name="first_name"
          value={this.state.first_name}
          onChange={e => this.handleInputChange(e)}
        />
        Last Name:{" "}
        <input
          type="text"
          name="last_name"
          value={this.state.last_name}
          onChange={e => this.handleInputChange(e)}
        />
        Username:{" "}
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={e => this.handleInputChange(e)}
        />
        SID:{" "}
        <input
          type="text"
          name="sid"
          value={this.state.sid}
          onChange={e => this.handleInputChange(e)}
        />
        <input
          type="checkbox"
          name="is_teacher"
          checked={this.state.is_teacher}
          onChange={e => this.handleInputChange(e)}
        />
        <input type="submit" value="Request" onClick={e => this.onRequest(e)} />
        <input type="button" value="Back" onClick={e => this.onBack(e)} />
      </form>
    );
  }
}
