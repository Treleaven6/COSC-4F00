"use strict";

import CreateAssignment from "./CreateAssignment.js";
import EditCourseInfo from "./EditCourseInfo.js";
import EnrollStudents from "./EnrollStudents.js";
import DeleteCourse from "./DeleteCourse.js";

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
    let assList = this.props.course["assignments"].map(assignment => (
      <li key={assignment.id}>
        <span>
          {"id: " +
            assignment.id +
            ", name: " +
            assignment.name +
            ", pdf: " +
            assignment.pdf +
            ", template: " +
            assignment.template}
        </span>
      </li>
    ));

    let display = null;
    if (this.state.isVisible["default"]) {
      display = (
        <div>
          <button onClick={e => this.onEditInfo(e)}>Edit info</button>
          <button onClick={e => this.onEnrollStudents(e)}>
            Enroll Students
          </button>
          <button onClick={e => this.onCreateNewAssignment(e)}>
            Create new assignment
          </button>
          <button onClick={e => this.onReviewPlagiarism(e)}>
            Review plagiarism reports (for the entire course)
          </button>
          <button onClick={e => this.onDeleteCourse(e)}>Delete course</button>
          <p>id: {this.props.course.id}</p>
          <p>description: {this.props.course.description}</p>
          <p>directory: {this.props.course.directory}</p>
          <p>year: {this.props.course.year}</p>
          <p>semester: {this.props.course.semester}</p>
          <ul>{assList}</ul>
        </div>
      );
    } else if (this.state.isVisible["createAssignment"]) {
      display = (
        <CreateAssignment
          goBack={this.resetVisible}
          cid={this.props.course.id}
          refreshList={this.props.refreshList}
        />
      );
    } else if (this.state.isVisible["editInfo"]) {
      display = <EditCourseInfo goBack={this.resetVisible} />;
    } else if (this.state.isVisible["deleteCourse"]) {
      display = <DeleteCourse goBack={this.resetVisible} />;
    } else if (this.state.isVisible["enrollStudents"]) {
      display = <EnrollStudents goBack={this.resetVisible} />;
    }
    return (
      <div>
        <h3>a Course</h3>
        <p>code: {this.props.course.code}</p>
        <p>name: {this.props.course.name}</p>
        {display}
      </div>
    );
  }
}
