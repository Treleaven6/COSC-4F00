"use strict";

import CreateAssignment from "./CreateAssignment.js";
import EditCourseInfo from "./EditCourseInfo.js";
import EnrolledList from "./EnrolledList.js";

// Display information about a course, allow some modifications to it

export default class Course extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.resetVisible = this.resetVisible.bind(this);
    this.state = {
      isVisible: {
        default: true,
        createAssignment: false,
        editInfo: false
      }
    };
    this.props.setReset(this.resetVisible);
  }

  // display default
  resetVisible() {
    this.setState({
      isVisible: {
        default: true,
        createAssignment: false,
        editInfo: false
      }
    });
  }

  // show EditCourseInfo component
  onEditInfo(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: false,
        editInfo: true
      }
    });
  }

  // show CreateAssignment component
  onCreateNewAssignment(e) {
    this.setState({
      isVisible: {
        default: false,
        createAssignment: true,
        editInfo: false
      }
    });
  }

  // TODO
  onReviewPlagiarism(e) {
    console.log("review plagiarism");
  }

  // display
  render() {
    // need to know:
    // what plagiarism reports are available
    let assList = this.props.course["assignments"].map(assignment => React.createElement(
      "li",
      { key: assignment.id },
      React.createElement(
        "span",
        null,
        "id: " + assignment.id + ", name: " + assignment.name
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
          { onClick: e => this.onCreateNewAssignment(e) },
          "Create new assignment"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onReviewPlagiarism(e) },
          "Review plagiarism reports (for the entire course)"
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
        React.createElement(EnrolledList, {
          course: this.props.course,
          updateEnrolled: this.props.updateEnrolled
        })
      );
    } else if (this.state.isVisible["createAssignment"]) {
      display = React.createElement(CreateAssignment, {
        goBack: this.resetVisible,
        cid: this.props.course.id,
        refreshList: this.props.refreshList
      });
    } else if (this.state.isVisible["editInfo"]) {
      display = React.createElement(EditCourseInfo, { goBack: this.resetVisible });
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