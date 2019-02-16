import React, { Component } from "react";
import { ListSchedule } from "./ListSchedule";
import { Course } from '../Teacher/Course';
import { Assignment } from '../Teacher/Assignment';

export class Teacher extends Component {
  constructor(props) {
    super(props);
    this.courseHandler = this.courseHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      courses: "",
      cid: "",
      aid: "",
      isVisible: {
        default: true,
        course: false,
        assignment: false
      }
    };
  }

  /*
Common to both:
- list of classes
- list of assignments (per class)
- calender

Student:
- request enrollment
- submit an assignment

Teacher:
- create a class
- enroll students
- create an assignment
- check assignmnet for plagiarism
- review plagiarism
   */

  onLogout(evt) {
    this.props.handleLogout();
  }

  courseHandler(obj) {
    this.setState({
      courses: obj
    });
  }

  handleClick(type, cid, aid) {
    //let course = this.state.courses.filter((c) => c.id === cid)[0];
    //let assignment = null;
    this.setState({
      cid: cid,
      aid: aid
    });

    if (type === "course") {
      this.setState({
        isVisible: {
          default: false,
          course: true,
          assignment: false
        }
      });
    } else if (type === "assignment") {
      this.setState({
        isVisible: {
          default: false,
          course: false,
          assignment: true
        }
      });
    }
    //console.log(type + ", " + cid + ", " + aid);
  }

  render() {
    let course = (this.state.cid === "" || this.state.cid === 0) ? null : this.state.courses.filter((c) => c.id === this.state.cid)[0];
    let assignment = (this.state.aid === "" || this.state.aid === 0) ? null : course.assignments.filter((a) => a.id === this.state.aid)[0];
    let mainPage = null;
    if (this.state.isVisible["course"]) {
      mainPage = <Course course={course}/>;
    } else if (this.state.isVisible["assignment"]) {
      // <Assignment course={course} assignmnet={assignment} />;
      mainPage = <Assignment course={course} assignment={assignment} />;
    } else {
      // default
      // put some announcements or a calender or something
    }

    return (
      <div>
        <p>a Teacher account</p>
        <button>Create new course</button>
        <button onClick={e => this.onLogout(e)}>Logout</button>
        <ListSchedule
          onCourses={this.courseHandler}
          onClick={this.handleClick}
          id={this.props.id}
          isTeacher="true"
        />
        <div>{mainPage}</div>
      </div>
    );
  }
}
