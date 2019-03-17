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
          <p>assignment id: {this.props.assignment.id}</p>
          <p>course id: {this.props.assignment.course}</p>
          <p>name: {this.props.assignment.name}</p>
          <p>pdf: {this.props.assignment.pdf}</p>
          <p>template: {this.props.assignment.template}</p>
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
          assignme={this.props.assignment}
        />
      );
    }

    return <div>{display}</div>;
  }
}
