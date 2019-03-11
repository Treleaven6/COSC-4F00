'use strict';

import ListSchedule from "./ListSchedule.js";
import Course from '../Teacher/Course.js';
import Assignment from '../Teacher/Assignment.js';
import CreateCourse from '../Teacher/CreateCourse.js';

export default class Teacher extends React.Component {
  constructor(props) {
    super(props);
    this.courseHandler = this.courseHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCancelCreateCourse = this.handleCancelCreateCourse.bind(this);
    this.disableAssignments = this.disableAssignments.bind(this);
    this.enableAssignments = this.enableAssignments.bind(this);
    this.state = {
      courses: "",
      cid: "",
      aid: "",
      sublist: true,
      isVisible: {
        default: true,
        course: false,
        assignment: false,
        create_new_course: false
      }
    };
  }

  onCreateNewCourse(evt) {
    this.setState({
      isVisible: {
        default: false,
        course: false,
        assignment: false,
        create_new_course: true
      }
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
        create_new_course: false
      }
    });
  }

  disableAssignments() {
    this.setState({
      sublist: false
    });
  }

  enableAssignments() {
    this.setState({
      sublist: true
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
          create_new_course: false
        }
      });
    } else if (type === "assignment") {
      this.setState({
        isVisible: {
          default: false,
          course: false,
          assignment: true,
          create_new_course: false
        }
      });
    }

    this.enableAssignments();
    //console.log(type + ", " + cid + ", " + aid);
  }

  render() {
    let course = this.state.cid === "" || this.state.cid === 0 ? null : this.state.courses.filter(c => c.id === this.state.cid)[0];
    let assignment = this.state.aid === "" || this.state.aid === 0 ? null : course.assignments.filter(a => a.id === this.state.aid)[0];
    let mainPage = null;
    if (this.state.isVisible["course"]) {
      mainPage = React.createElement(Course, { course: course });
    } else if (this.state.isVisible["assignment"]) {
      // <Assignment course={course} assignmnet={assignment} />;
      mainPage = React.createElement(Assignment, { course: course, assignment: assignment, spotlight: this.disableAssignments, unspotlight: this.enableAssignments });
    } else if (this.state.isVisible["create_new_course"]) {
      mainPage = React.createElement(CreateCourse, { onCancel: this.handleCancelCreateCourse });
    } else {
      // default
      // put some announcements or a calender or something
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'a Teacher account'
      ),
      React.createElement(
        'button',
        { onClick: e => this.onCreateNewCourse(e) },
        'Create new course'
      ),
      React.createElement(
        'button',
        { onClick: e => this.onLogout(e) },
        'Logout'
      ),
      React.createElement(ListSchedule, {
        onCourses: this.courseHandler,
        onClick: this.handleClick,
        id: this.props.id,
        isTeacher: 'true',
        sublist: this.state.sublist
      }),
      React.createElement(
        'div',
        null,
        mainPage
      )
    );
  }
}