"use strict";

import DetectAssignment from "./Plagiarism/DetectAssignment.js";
import EditAssignmentInfo from "./EditAssignmentInfo.js";
import DeleteAssignment from "./DeleteAssignment.js";

export default class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      aid: this.props.assignment.id,
      download_file: null,
      isVisible: {
        default: true,
        editInfo: false,
        delete: false,
        detect: false,
        review: false,
        download: false
      }
    };
    this.props.setReset(this.onBack);
  }

  onBack() {
    this.setState({
      isVisible: {
        default: true,
        editInfo: false,
        delete: false,
        detect: false,
        review: false,
        download: false
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
        review: false,
        download: false
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
        review: false,
        download: false
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
        review: false,
        download: false
      }
    });
  }

  onReviewPlagiarism(e) {
    // another component, have to search database, display results
    console.log("review plagiarism");
  }

  onExport(e) {
    //console.log("requested export");
    const path = "./api.php/exportass/" + this.props.assignment.course + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      if (res.data == "nothing to export") {
        console.log("nothing to export");
      } else {
        this.setState({
          download_file: res.data,
          isVisible: {
            default: false,
            editInfo: false,
            delete: false,
            detect: false,
            review: false,
            download: true
          }
        });
      }
    });
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
          "button",
          { onClick: e => this.onExport(e) },
          "Export"
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
    } else if (this.state.isVisible["download"]) {
      display = React.createElement(
        "div",
        null,
        React.createElement(
          "a",
          { href: this.state.download_file, download: "files.zip" },
          "Download"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onBack(e) },
          "Cancel"
        )
      );
    }

    return React.createElement(
      "div",
      null,
      display
    );
  }
}