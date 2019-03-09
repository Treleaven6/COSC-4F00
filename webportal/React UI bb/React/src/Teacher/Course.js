'use strict';

export default class Course extends React.Component {

  onEditInfo(e) {
    // another component, with fields for all the values
    console.log("edit info");
  }

  onEnrollStudents(e) {
    // another component, with a search bar or maybe a file upload
    console.log("enroll students");
  }

  onCreateNewAssignment(e) {
    // another component, with fields and file uploads
    console.log("create new assignment");
  }

  onReviewPlagiarism(e) {
    // another component, have to search for reports and then display
    console.log("review plagiarism");
  }

  onDeleteCourse(e) {
    // dialogue box, asking if sure, and then a lot of databse stuff
    console.log("delete course");
  }

  render() {
    // need to know:
    // what plagiarism reports are available
    let assList = this.props.course["assignments"].map(assignment => (
      <li key={assignment.id}>
        <span>{"id: " + assignment.id + ", name: " + assignment.name + ", pdf: " + assignment.pdf + ", template: " + assignment.template}</span>
      </li>
    ));
    return (
      <div>
        <p>a Course</p>
        <button onClick={e => this.onEditInfo(e)}>Edit info</button>
        <button onClick={e => this.onEnrollStudents(e)}>Enroll Students</button>
        <button onClick={e => this.onCreateNewAssignment(e)}>Create new assignment</button>
        <button onClick={e => this.onReviewPlagiarism(e)}>Review plagiarism reports (for the entire course)</button>
        <button onClick={e => this.onDeleteCourse(e)}>Delete course</button>
        <p>id: {this.props.course.id}</p>
        <p>code: {this.props.course.code}</p>
        <p>name: {this.props.course.name}</p>
        <p>description: {this.props.course.description}</p>
        <p>directory: {this.props.course.directory}</p>
        <p>year: {this.props.course.year}</p>
        <p>semester: {this.props.course.semester}</p>
        <ul>{assList}</ul>
      </div>
    );
  }
}
