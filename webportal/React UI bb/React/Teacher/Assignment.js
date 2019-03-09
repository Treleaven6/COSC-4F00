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
    return React.createElement(
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
        "pdf: ",
        this.props.assignment.pdf
      ),
      React.createElement(
        "p",
        null,
        "template: ",
        this.props.assignment.template
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
  }
}