"use strict";

import ListSchedule from "./ListSchedule.js";
import Course from "../Student/Course.js";
import Assignment from "../Student/Assignment.js";
import ChangePassword from "../Student/ChangePassword.js";

// What a student will see when they first sign in
export default class Student extends React.Component {
  constructor(props) {
    super(props);
    this.courseHandler = this.courseHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInstructor = this.handleInstructor.bind(this);
    this.handleSubmitTime = this.handleSubmitTime.bind(this);
    this.setResetAssignments = this.setResetAssignments.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.state = {
      courses: "",
      cid: "",
      aid: "",
      resetAssignments: null,
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        changePassword: false
      }
    };
  }

  setResetAssignments(f) {
    this.setState({
      resetAssignments: f
    });
  }

  onLogout(evt) {
    this.props.handleLogout();
  }

  courseHandler(obj) {
    this.setState({
      courses: obj
    });
  }

  handleBack() {
    this.setState({
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        changePassword: false
      }
    });
  }

  handleClick(type, cid, aid) {
    this.setState({
      cid: cid,
      aid: aid
    });

    if (type === "course") {
      this.setState({
        isVisible: {
          default: false,
          course: true,
          assignment: false,
          changePassword: false
        }
      });
    } else if (type === "assignment") {
      if (this.state.isVisible["assignment"] && this.state.resetAssignments !== null) {
        this.state.resetAssignments();
      }
      this.setState({
        isVisible: {
          default: false,
          course: false,
          assignment: true,
          changePassword: false
        }
      });
    }
  }

  handleInstructor(course) {
    let courses = this.state.courses;
    let i = 0;
    while (i < courses.length) {
      if (courses[i].id === course.id) break;
      i += 1;
    }
    courses[i] = course;
    this.setState({
      courses: courses
    });
  }

  handleSubmitTime(submit_time, aid, cid) {
    let courses = this.state.courses;
    let c = 0;
    while (c < courses.length) {
      if (courses[c].id === cid) break;
      c += 1;
    }
    let a = 0;
    while (a < courses[c].assignments.length) {
      if (courses[c].assignments[a].id === aid) break;
      a++;
    }
    courses[c].assignments[a]["submit_time"] = submit_time;
    this.setState({
      courses: courses
    });
  }

  onEnroll(e) {
    console.log("enroll in a course");
  }

  onChangePassword(e) {
    this.setState({
      isVisible: {
        default: false,
        course: false,
        assignment: false,
        changePassword: true
      }
    });
  }

  render() {
    let course =
      this.state.cid === "" || this.state.cid === 0
        ? null
        : this.state.courses.filter(c => c.id === this.state.cid)[0];
    let assignment =
      this.state.aid === "" || this.state.aid === 0
        ? null
        : course.assignments.filter(a => a.id === this.state.aid)[0];
    let mainPage = null;
    if (this.state.isVisible["course"]) {
      mainPage = (
        <Course course={course} onInstructor={this.handleInstructor} />
      );
    } else if (this.state.isVisible["assignment"]) {
      mainPage = (
        <Assignment
          sid={this.props.id}
          course={course}
          assignment={assignment}
          onSubmitTime={this.handleSubmitTime}
          setReset={this.setResetAssignments}
        />
      );
    } else if (this.state.isVisible["changePassword"]) {
      mainPage = (
        <ChangePassword sid={this.props.id} goBack={this.handleBack} />
      );
    } else {
      // default
      // put some announcements or a calender or something
    }

    return (
      <div>
        <p>a Student account</p>
        <button onClick={e => this.onEnroll(e)}>enroll in a course</button>
        <button onClick={e => this.onChangePassword(e)}>change password</button>
        <button onClick={e => this.onLogout(e)}>Logout</button>
        <ListSchedule
          onCourses={this.courseHandler}
          onClick={this.handleClick}
          id={this.props.id}
          isTeacher="false"
          setRefresh={this.setResetAssignments}
        />
        <div>{mainPage}</div>
      </div>
    );
  }
}
