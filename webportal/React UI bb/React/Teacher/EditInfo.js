"use strict";

export default class EditInfo extends React.Component {
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
        "Name: ",
        React.createElement("input", { type: "text" }),
        "Something else: ",
        React.createElement("input", { type: "test" }),
        React.createElement("input", { type: "submit", value: "Create" }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}