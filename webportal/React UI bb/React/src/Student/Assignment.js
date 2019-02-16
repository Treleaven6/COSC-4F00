import React, { Component } from "react";

// what happens when wrong NodeJS api call?
// what happens when can't connect to NodeJS?
// what happens when NodeJS can't connect to mysql?

export class Assignment extends Component {
  callSingleAssignmentApi = async () => {
    const response = await fetch(
      "/submitted/student/" +
        this.props.sid +
        "/assignment/" +
        this.props.assignment.id
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    if (typeof this.props.assignment["submit_time"] === "undefined") {
      this.callSingleAssignmentApi()
        .then(res => {
          let submit_time = 0;
          if (res.length !== 0) {
            submit_time = res[0].submit_time;
          }
          this.props.onSubmitTime(
            submit_time,
            this.props.assignment.id,
            this.props.course.id
          );
        })
        .catch(err => console.log(err));
    }

    let submit_button_text = "submit";
    if (this.props.assignment.submit_time !== 'undefined') {
      if (this.props.assignment.submit_time !== 0) {
        // in future, should also check if assignment has closed?
        submit_button_text = "resubmit";
      }
    }

    // when submit, display a new page (or like floating-in-front box?)
    // need to do file upload, changing names, zipping, put it in the right directory, oh boy

    return (
      <div>
        <p>an Assignment</p>
        <button>{submit_button_text}</button>
        <p>previously submitted at time: {this.props.assignment.submit_time}</p>
        <p>assignment id: {this.props.assignment.id}</p>
        <p>course id: {this.props.assignment.course}</p>
        <p>name: {this.props.assignment.name}</p>
        <p>pdf: {this.props.assignment.pdf}</p>
        <p>template: {this.props.assignment.template}</p>
        <p>From course</p>
        <p>name: {this.props.course.name}</p>
        <p>year: {this.props.course.year}</p>
        <p>semester: {this.props.course.semester}</p>
      </div>
    );
  }
}
