"use strict";

import ListSchedule from "./ListSchedule.js";
import Course from "../Teacher/Course.js";
import Assignment from "../Teacher/Assignment.js";
import ChangePassword from "../Teacher/ChangePassword.js";

// What a teacher will see when they first sign in
export default class Teacher extends React.Component {
  constructor(props) {
    super(props);
    this.courseHandler = this.courseHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCancelCreateCourse = this.handleCancelCreateCourse.bind(this);
    this.setResetCourses = this.setResetCourses.bind(this);
    this.setResetAssignments = this.setResetAssignments.bind(this);
    this.updateAssignmentInfo = this.updateAssignmentInfo.bind(this);
    this.setResetListSchedule = this.setResetListSchedule.bind(this);
    this.updateAssignmentList = this.updateAssignmentList.bind(this);
    this.updateEnrolled = this.updateEnrolled.bind(this);
    this.state = {
      courses: "",
      cid: "",
      aid: "",
      sublist: true,
      resetCourses: null,
      resetAssignments: null,
      resetListSchedule: null,
      visibleOverride: false,
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        change_password: false
      }
    };
  }

  setResetListSchedule(f) {
    this.setState({
      resetListSchedule: f
    });
  }

  updateAssignmentList() {
    this.state.resetListSchedule();
    if (!this.state.visibleOverride && this.state.isVisible["assignment"]) {
      this.setState({
        isVisible: {
          default: true,
          course: false,
          assignment: false,
          change_password: false
        }
      });
    } else {
      this.setState({
        visibleOverride: false
      });
    }
  }

  updateEnrolled(enrolledList) {
    let course = this.state.courses.filter(c => c.id === this.state.cid)[0];
    course["enrolledList"] = enrolledList;
  }

  updateAssignmentInfo(name, closing) {
    let course = this.state.cid === "" || this.state.cid === 0 ? null : this.state.courses.filter(c => c.id === this.state.cid)[0];
    let assignment = this.state.aid === "" || this.state.aid === 0 ? null : course.assignments.filter(a => a.id === this.state.aid)[0];
    assignment.name = name;
    assignment.closing = closing;
    this.setState({
      visibleOverride: true
    });
  }

  setResetCourses(f) {
    this.setState({
      resetCourses: f
    });
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

  handleCancelCreateCourse() {
    this.setState({
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        change_password: false
      }
    });
  }

  onChangePassword(e) {
    this.setState({
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        change_password: true
      }
    });
  }

  handleClick(type, cid, aid) {
    this.setState({
      cid: cid,
      aid: aid
    });

    if (type === "course") {
      if (this.state.isVisible["course"] && this.state.resetCourses !== null) {
        this.state.resetCourses();
      }
      this.setState({
        isVisible: {
          default: false,
          course: true,
          assignment: false
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
          assignment: true
        }
      });
    }

    //console.log(type + ", " + cid + ", " + aid);
  }

  render() {
    let course = this.state.cid === "" || this.state.cid === 0 ? null : this.state.courses.filter(c => c.id === this.state.cid)[0];
    let assignment = this.state.aid === "" || this.state.aid === 0 ? null : course.assignments.filter(a => a.id === this.state.aid)[0];

    let mainPage = null;
    if (this.state.isVisible["course"]) {
      mainPage = React.createElement(Course, {
        course: course,
        setReset: this.setResetCourses,
        refreshList: this.updateAssignmentList,
        updateEnrolled: this.updateEnrolled
      });
    } else if (this.state.isVisible["assignment"]) {
      mainPage = React.createElement(Assignment, {
        course: course,
        assignment: assignment,
        setReset: this.setResetAssignments,
        updateInfo: this.updateAssignmentInfo,
        refreshList: this.updateAssignmentList,
        updateEnrolled: this.updateEnrolled
      });
    } else if (this.state.isVisible["change_password"]) {
      mainPage = React.createElement(ChangePassword, {
        tid: this.props.id,
        goBack: this.handleCancelCreateCourse
      });
    } else {
      // default
      // put some announcements or a calender or something
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "a Teacher account"
      ),
      React.createElement(
        "button",
        { onClick: e => this.onChangePassword(e) },
        "change password"
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
        isTeacher: "true",
        setRefresh: this.setResetListSchedule
      }),
      React.createElement(
        "div",
        null,
        mainPage
      )
    );
  }
}