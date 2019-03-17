"use strict";

export default class EnrollStudents extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

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
          "Enroll Students"
        ),
        "Name: ",
        React.createElement("input", { type: "text" }),
        "Something else: ",
        React.createElement("input", { type: "test" }),
        React.createElement("input", { type: "submit", value: "Enroll" }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}