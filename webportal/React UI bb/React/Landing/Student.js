'use strict';

import ListSchedule from "./ListSchedule.js";
import Course from "../Student/Course.js";
import Assignment from "../Student/Assignment.js";

// almost exactly the same as teacher save a few strings, boolean isTeacher, and imports
export default class Student extends React.Component {
  constructor(props) {
    super(props);
    this.courseHandler = this.courseHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInstructor = this.handleInstructor.bind(this);
    this.handleSubmitTime = this.handleSubmitTime.bind(this);
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

  onLogout(evt) {
    this.props.handleLogout();
  }

  courseHandler(obj) {
    this.setState({
      courses: obj
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

  render() {
    let course = this.state.cid === "" || this.state.cid === 0 ? null : this.state.courses.filter(c => c.id === this.state.cid)[0];
    let assignment = this.state.aid === "" || this.state.aid === 0 ? null : course.assignments.filter(a => a.id === this.state.aid)[0];
    let mainPage = null;
    if (this.state.isVisible["course"]) {
      mainPage = React.createElement(Course, { course: course, onInstructor: this.handleInstructor });
    } else if (this.state.isVisible["assignment"]) {
      mainPage = React.createElement(Assignment, {
        sid: this.props.id,
        course: course,
        assignment: assignment,
        onSubmitTime: this.handleSubmitTime
      });
    } else {
      // default
      // put some announcements or a calender or something
    }

    let sublist = true;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "a Student account"
      ),
      React.createElement(
        "button",
        { onClick: e => this.onEnroll(e) },
        "enroll in a course"
      ),
      React.createElement(
        "button",
        { onClick: e => this.onLogout(e) },
        "Logout"
      ),
      React.createElement(ListSchedule, {
        onCourses: this.courseHandler,
        onClick: this.handleClick,
        id: this.props.id,
        isTeacher: "false",
        sublist: sublist
      }),
      React.createElement(
        "div",
        null,
        mainPage
      )
    );
  }
}