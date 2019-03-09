'use strict';

export default class Assignment extends React.Component {
  // need to know:
  // who has submitted so far

  onEditInfo(e) {
    // another component, with fields for every value
    console.log("edit info");
  }

  onDeleteAssignment(e) {
    // dialogue box asking if sure, and then a lot of database stuff
    console.log("delete assignment");
  }
  
  onDetectPlagiarism(e) {
    // another component, with ?
    console.log("detect plagiarism");
  }

  onReviewPlagiarism(e) {
    // another component, have to search database, display results
    console.log("review plagiarism");
  }

  render() {
    return (
      <div>
        <p>an Assignment</p>
        <button onClick={e => this.onEditInfo(e)}>Edit info</button>
        <button onClick={e => this.onDeleteAssignment(e)}>Delete Assignment</button>
        <button onClick={e => this.onDetectPlagiarism(e)}>Detect plagiarism</button>
        <button onClick={e => this.onReviewPlagiarism(e)}>Review plagiarism reports (for just this assignment)</button>
        <p>assignment id: {this.props.assignment.id}</p>
        <p>course id: {this.props.assignment.course}</p>
        <p>name: {this.props.assignment.name}</p>
        <p>pdf: {this.props.assignment.pdf}</p>
        <p>template: {this.props.assignment.template}</p>
        <p>From course</p>
        <p>name: {this.props.course.name}</p>
        <p>year: {this.props.course.year}</p>
        <p>semester: {this.props.course.semester}</p>
      </div>
    );
  }
}
