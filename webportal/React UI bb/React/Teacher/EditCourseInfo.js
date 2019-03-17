"use strict";

export default class EditCourseInfo extends React.Component {
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