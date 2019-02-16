import React, { Component } from "react";

export class Course extends Component {
  render() {
    // need to know:
    // what plagiarism reports are available
    let assList = this.props.course["assignments"].map(assignment => (
      <li key={assignment.id}>
        <span>{"id: " + assignment.id + ", name: " + assignment.name + ", pdf: " + assignment.pdf + ", template: " + assignment.template}</span>
      </li>
    ));
    return (
      <div>
        <p>a Course</p>
        <button>Edit info</button>
        <button>Enroll Students</button>
        <button>Create new assignment</button>
        <button>Review plagiarism reports (for the entire course)</button>
        <button>Delete course</button>
        <p>id: {this.props.course.id}</p>
        <p>code: {this.props.course.code}</p>
        <p>name: {this.props.course.name}</p>
        <p>description: {this.props.course.description}</p>
        <p>directory: {this.props.course.directory}</p>
        <p>year: {this.props.course.year}</p>
        <p>semester: {this.props.course.semester}</p>
        <ul>{assList}</ul>
      </div>
    );
  }
}
