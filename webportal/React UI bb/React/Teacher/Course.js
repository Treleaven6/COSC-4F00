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
    let assList = this.props.course["assignments"].map(assignment => React.createElement(
      "li",
      { key: assignment.id },
      React.createElement(
        "span",
        null,
        "id: " + assignment.id + ", name: " + assignment.name + ", pdf: " + assignment.pdf + ", template: " + assignment.template
      )
    ));
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "a Course"
      ),
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
        "code: ",
        this.props.course.code
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
      )
    );
  }
}