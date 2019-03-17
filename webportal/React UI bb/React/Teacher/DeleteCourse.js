"use strict";

export default class DeleteCourse extends React.Component {
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
          "Are you Sure?"
        ),
        React.createElement("input", { type: "submit", value: "Yes, Delete" }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}