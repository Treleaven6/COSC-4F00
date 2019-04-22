"use strict";

// Allow a teacher to delete an assignment

export default class DeleteAssignment extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  // tell parent (Assignment) to go back
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // call backend, tell parent (Assignment)
  onConfirm(e) {
    e.preventDefault();
    let path = "./api.php/delass/" + this.props.id;
    axios.post(path).then(res => {
      this.props.refreshList();
    });
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