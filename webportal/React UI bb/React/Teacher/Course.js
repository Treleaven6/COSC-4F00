"use strict";

import CreateAssignment from "./CreateAssignment.js";
import EditCourseInfo from "./EditCourseInfo.js";
import EnrollStudents from "./EnrollStudents.js";
import DeleteCourse from "./DeleteCourse.js";
import EnrolledList from "./EnrolledList.js";

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.resetVisible = this.resetVisible.bind(this);
    this.state = {
      isVisible: {
        default: true,
        createAssignment: false,
        editInfo: false,
        deleteCourse: false,
        enrollStudents: false
      }
    };
    this.props.setReset(this.resetVisible);
  }

  resetVisible() {
    this.setState({
      isVisible: {
        default: true,
        createAssignment: false,
        editInfo: false,
        deleteCourse: false,
        enrollStudents: false
      }
    });
  }

  onEditInfo(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: false,
        editInfo: true,
        deleteCourse: false,
        enrollStudents: false
      }
    });
  }

  onEnrollStudents(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: false,
        editInfo: false,
        deleteCourse: false,
        enrollStudents: true
      }
    });
  }

  onCreateNewAssignment(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: true,
        editInfo: false,
        deleteCourse: false,
        enrollStudents: false
      }
    });
  }

  onReviewPlagiarism(e) {
    console.log("review plagiarism");
  }

  onDeleteCourse(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: false,
        editInfo: false,
        deleteCourse: true,
        enrollStudents: false
      }
    });
  }

  render() {
    // need to know:
    // what plagiarism reports are available
    let assList = this.props.course["assignments"].map(assignment => React.createElement(
      "li",
      { key: assignment.id },
      React.createElement(
        "span",
        null,
        "id: " + assignment.id + ", name: " + assignment.name + ", pdf: " + assignment.pdf + ", template: " + assignment.template
      )
    ));

    let display = null;
    if (this.state.isVisible["default"]) {
      display = React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: e => this.onEditInfo(e) },
          "Edit info"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onEnrollStudents(e) },
          "Enroll Students"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onCreateNewAssignment(e) },
          "Create new assignment"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onReviewPlagiarism(e) },
          "Review plagiarism reports (for the entire course)"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onDeleteCourse(e) },
          "Delete course"
        ),
        React.createElement(
          "p",
          null,
          "id: ",
          this.props.course.id
        ),
        React.createElement(
          "p",
          null,
          "description: ",
          this.props.course.description
        ),
        React.createElement(
          "p",
          null,
          "directory: ",
          this.props.course.directory
        ),
        React.createElement(
          "p",
          null,
          "year: ",
          this.props.course.year
        ),
        React.createElement(
          "p",
          null,
          "semester: ",
          this.props.course.semester
        ),
        React.createElement(
          "ul",
          null,
          assList
        ),
        React.createElement(
          "p",
          null,
          "List of Enrolled students"
        ),
        React.createElement(EnrolledList, { course: this.props.course, updateEnrolled: this.props.updateEnrolled })
      );
    } else if (this.state.isVisible["createAssignment"]) {
      display = React.createElement(CreateAssignment, {
        goBack: this.resetVisible,
        cid: this.props.course.id,
        refreshList: this.props.refreshList
      });
    } else if (this.state.isVisible["editInfo"]) {
      display = React.createElement(EditCourseInfo, { goBack: this.resetVisible });
    } else if (this.state.isVisible["deleteCourse"]) {
      display = React.createElement(DeleteCourse, { goBack: this.resetVisible });
    } else if (this.state.isVisible["enrollStudents"]) {
      display = React.createElement(EnrollStudents, { goBack: this.resetVisible });
    }
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        "a Course"
      ),
      React.createElement(
        "p",
        null,
        "code: ",
        this.props.course.code
      ),
      React.createElement(
        "p",
        null,
        "name: ",
        this.props.course.name
      ),
      display
    );
  }
}