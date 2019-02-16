import React, { Component } from "react";

export class Course extends Component {
  callPersonApi = async () => {
    const response = await fetch("/person/" + this.props.course.instructor);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    if (
      typeof this.props.course["firstname"] === "undefined" &&
      typeof this.props.course["lastname"] === "undefined"
    ) {
      this.callPersonApi()
        .then(res => {
          let course = this.props.course;
          course["firstname"] = res[0].firstname;
          course["lastname"] = res[0].lastname;
          this.props.onInstructor(course);
        })
        .catch(err => console.log(err));
    }

    return (
      <div>
        <p>a Course</p>
        <p>id: {this.props.course.id}</p>
        <p>code: {this.props.course.code}</p>
        <p>name: {this.props.course.name}</p>
        <p>
          instructor: {this.props.course.firstname} {this.props.course.lastname}
        </p>
        <p>description: {this.props.course.description}</p>
        <p>year: {this.props.course.year}</p>
        <p>semester: {this.props.course.semester}</p>
      </div>
    );
  }
}
