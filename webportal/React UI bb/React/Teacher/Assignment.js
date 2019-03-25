"use strict";

import DetectAssignment from "./Plagiarism/DetectAssignment.js";
import EditAssignmentInfo from "./EditAssignmentInfo.js";
import DeleteAssignment from "./DeleteAssignment.js";

export default class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.resetVisible = this.resetVisible.bind(this);
    this.state = {
      aid: this.props.assignment.id,
      isVisible: {
        default: true,
        editInfo: false,
        delete: false,
        detect: false,
        review: false
      }
    };
    this.props.setReset(this.resetVisible);
  }

  resetVisible() {
    this.setState({
      isVisible: {
        default: true,
        editInfo: false,
        delete: false,
        detect: false,
        review: false
      }
    });
  }

  onBack() {
    this.setState({
      isVisible: {
        default: true,
        editInfo: false,
        delete: false,
        detect: false,
        review: false
      }
    });
  }

  onEditInfo(e) {
    // another component, with fields for every value
    this.setState({
      isVisible: {
        default: false,
        editInfo: true,
        delete: false,
        detect: false,
        review: false
      }
    });
  }

  onDeleteAssignment(e) {
    this.setState({
      isVisible: {
        default: false,
        editInfo: false,
        delete: true,
        detect: false,
        review: false
      }
    });
  }

  onDetectPlagiarism(e) {
    this.setState({
      isVisible: {
        default: false,
        editInfo: false,
        delete: false,
        detect: true,
        review: false
      }
    });
  }

  onReviewPlagiarism(e) {
    // another component, have to search database, display results
    console.log("review plagiarism");
  }

  render() {
    let display;

    if (this.state.isVisible["default"]) {
      display = React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          "an Assignment"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onEditInfo(e) },
          "Edit info"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onDeleteAssignment(e) },
          "Delete Assignment"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onDetectPlagiarism(e) },
          "Detect plagiarism"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onReviewPlagiarism(e) },
          "Review plagiarism reports (for just this assignment)"
        ),
        React.createElement(
          "p",
          null,
          "assignment id: ",
          this.props.assignment.id
        ),
        React.createElement(
          "p",
          null,
          "course id: ",
          this.props.assignment.course
        ),
        React.createElement(
          "p",
          null,
          "name: ",
          this.props.assignment.name
        ),
        React.createElement(
          "p",
          null,
          "closing: ",
          this.props.assignment.closing,
          " "
        ),
        React.createElement(
          "p",
          null,
          "From course"
        ),
        React.createElement(
          "p",
          null,
          "name: ",
          this.props.course.name
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
        )
      );
    } else if (this.state.isVisible["editInfo"]) {
      display = React.createElement(EditAssignmentInfo, {
        updateParent: this.props.updateInfo,
        id: this.props.assignment.id,
        name: this.props.assignment.name,
        closing: this.props.assignment.closing,
        goBack: this.onBack,
        refreshList: this.props.refreshList
      });
    } else if (this.state.isVisible["delete"]) {
      display = React.createElement(DeleteAssignment, {
        goBack: this.onBack,
        name: this.props.assignment.name,
        id: this.props.assignment.id,
        refreshList: this.props.refreshList
      });
    } else if (this.state.isVisible["detect"]) {
      display = React.createElement(DetectAssignment, {
        goBack: this.onBack,
        assignment: this.props.assignment,
        course: this.props.course,
        assignment: this.props.assignment,
        updateEnrolled: this.props.updateEnrolled
      });
    }

    return React.createElement(
      "div",
      null,
      display
    );
  }
}