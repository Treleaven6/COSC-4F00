"use strict";

import DetectAssignment from "./Plagiarism/DetectAssignment.js";
import EditAssignmentInfo from "./EditAssignmentInfo.js";
import DeleteAssignment from "./DeleteAssignment.js";

// Display information about an assignments and options 
// to change it

export default class Assignment extends React.Component {
  // constructor
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

  // reset display to default
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

  // display the EditAssignmentInfo component
  onEditInfo(e) {
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

  // display the DeleteAssignment component
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

  // display the DetectAssignment component
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

  // TODO
  onReviewPlagiarism(e) {
    // another component, have to search database, display results
    console.log("review plagiarism");
  }

  // call the backend, allow user to download a zip of all current submissions
  onExport(e) {
    const path = "./api.php/exportass/" + this.props.assignment.course + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      if (res.data == "nothing to export") {
        console.log("nothing to export")
      } else {
        this.setState({
          download_file: res.data,
          isVisible: {
            default: false,
            editInfo: false,
            delete: false,
            detect: false,
            review: false,
            download: true,
          }
        });
      }
    });
  }

  // display
  render() {
    let display;

    if (this.state.isVisible["default"]) {
      display = (
        <div>
          <p>an Assignment</p>
          <button onClick={e => this.onEditInfo(e)}>Edit info</button>
          <button onClick={e => this.onDeleteAssignment(e)}>
            Delete Assignment
          </button>
          <button onClick={e => this.onDetectPlagiarism(e)}>
            Detect plagiarism
          </button>
          <button onClick={e => this.onReviewPlagiarism(e)}>
            Review plagiarism reports (for just this assignment)
          </button>
          <button onClick={e => this.onExport(e)}>
            Export
          </button>
          <p>assignment id: {this.props.assignment.id}</p>
          <p>course id: {this.props.assignment.course}</p>
          <p>name: {this.props.assignment.name}</p>
          <p>closing: {this.props.assignment.closing} </p>
          <p>From course</p>
          <p>name: {this.props.course.name}</p>
          <p>year: {this.props.course.year}</p>
          <p>semester: {this.props.course.semester}</p>
        </div>
      );
    } else if (this.state.isVisible["editInfo"]) {
      display = (
        <EditAssignmentInfo
          updateParent={this.props.updateInfo}
          id={this.props.assignment.id}
          name={this.props.assignment.name}
          closing={this.props.assignment.closing}
          goBack={this.onBack}
          refreshList={this.props.refreshList}
        />
      );
    } else if (this.state.isVisible["delete"]) {
      display = (
        <DeleteAssignment
          goBack={this.onBack}
          name={this.props.assignment.name}
          id={this.props.assignment.id}
          refreshList={this.props.refreshList}
        />
      );
    } else if (this.state.isVisible["detect"]) {
      display = (
        <DetectAssignment
          goBack={this.onBack}
          assignment={this.props.assignment}
          course={this.props.course}
          assignment={this.props.assignment}
          updateEnrolled={this.props.updateEnrolled}
        />
      );
    } else if (this.state.isVisible["download"]) {
      display = (
        <div>
        <a href = {this.state.download_file} download="files.zip">Download</a>
        <button onClick={e => this.onBack(e)}>
            Go Back
        </button>
        </div>
      )
    }

    return <div>{display}</div>;
  }
}
