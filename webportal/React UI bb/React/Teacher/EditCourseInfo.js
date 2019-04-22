"use strict";

// Allow a teacher to edit course information
// Currently non-functional

export default class EditCourseInfo extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  // tell parent (Course) to go back
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // display
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        null,
        React.createElement(
          "h3",
          null,
          "Edit Info"
        ),
        "Description: ",
        React.createElement("input", { type: "text" }),
        React.createElement("input", { type: "submit", value: "Update" }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}