"use strict";

export default class DeleteAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  onConfirm(e) {
    e.preventDefault();
    let path = "./api.php/delass/" + this.props.id;
    axios.post(path).then(res => {
      this.props.refreshList();
    });
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
          "Delete Assignment: ",
          this.props.name
        ),
        React.createElement("input", {
          type: "submit",
          value: "Confirm",
          onClick: e => this.onConfirm(e)
        }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}