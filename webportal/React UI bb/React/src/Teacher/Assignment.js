import React, { Component } from "react";

export class Assignment extends Component {
  // need to know:
  // who has submitted so far

  render() {
    return (
      <div>
        <p>an Assignment</p>
        <button>Edit info</button>
        <button>Delete Assignment</button>
        <button>Detect plagiarism</button>
        <button>Review plagiarism reports (for just this assignment)</button>
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
